# GitHub Actions to Hostinger VPS

The `Security, build and deploy` workflow audits, lints, builds, and tests on
GitHub. Only successful pushes to `main` and manual runs on `main` publish the
tested image to `ghcr.io/andrenoj11/compro-green-ridge-technics`. Pull requests
and weekly security checks never publish or deploy.

The tested Docker image is transferred between jobs as a one-day artifact;
the publish job does not rebuild it. Deployment uses its immutable digest.
Images are intended to be PUBLIC (approved for this public-source project),
but new GHCR packages default to private until the owner changes visibility.
No registry PAT is required: publishing uses `GITHUB_TOKEN` and the VPS pulls
anonymously once the package is public. Never put secrets in Docker build args.

## 1. Publish the first image

Commit and push the deployment changes to `main`, then open GitHub → Actions →
Security, build and deploy. `verify` and `publish` must pass. `deploy` is skipped
until the repository variable `VPS_DEPLOY_ENABLED` is set to `true`.

After the first successful publish, go to the GitHub account's **Packages** →
`compro-green-ridge-technics` → Package settings → Change visibility → Public.
Repository visibility does not automatically make the package public. If a
package with that name already exists, grant this repository Actions access
from its package settings before retrying a denied push.

## 2. Create a dedicated CI key on the Mac

Use a new key, separate from the passphrase-protected personal admin key:

```sh
ssh-keygen -t ed25519 -C green-ridge-github-actions -f ~/.ssh/green_ridge_ci
```

Leave the passphrase empty for this CI-only key. If prompted to overwrite an
existing file, answer `n` and inspect it before proceeding. Keep the private
key out of git and chat. Upload ONLY its public half to the VPS:

```sh
scp -i ~/.ssh/green_ridge_vps ~/.ssh/green_ridge_ci.pub deploy@187.124.139.202:/home/deploy/green_ridge_ci.pub
```

## 3. Install restricted deployment access on the VPS

In the existing `deploy` SSH session:

```sh
cd /opt/green-ridge
git pull --ff-only
sudo bash deploy/setup-ci.sh /home/deploy/green_ridge_ci.pub
```

The installer does not restart the website. It creates the dedicated `grt-ci`
account, a root-owned authorized key with a forced command, and root-owned
deployment files under `/etc/green-ridge-ci` and `/usr/local/sbin`. The account
is not added to the Docker or sudo admin groups. Its only passwordless sudo
permission is the fixed deployment command with no arguments.

The key cannot open an interactive shell, forward ports, or upload files. Its
forced command reads one SHA-256 digest from standard input, pulls only from the
fixed repository, and uses a root-owned Compose definition with no host mounts
or exposed application ports. The key still authorizes replacing the website,
so protect it as a deployment credential. The Compose project remains
`green-ridge`; the existing Caddy container and certificate volumes are retained.

Test restricted SSH access from the Mac WITHOUT deploying anything:

```sh
printf 'invalid\n' | ssh -T -o IdentitiesOnly=yes -i ~/.ssh/green_ridge_ci grt-ci@187.124.139.202
```

Expected: `Invalid image digest.` and a nonzero exit code. A shell or sudo
password prompt is NOT expected. If login is denied, keep the admin session
open and inspect `sudo journalctl -u ssh --since '5 minutes ago'`.

## 4. Configure GitHub variables, secrets, and environment

In the repository's Settings → Environments, create `production`. Restrict its
deployment branches to `main`. Required reviewers are optional if manual
approval on every deployment is desired.

Under Settings → Secrets and variables → Actions, add these **repository
variables** (not environment variables):

| Variable | Value |
| --- | --- |
| `VPS_HOST` | `187.124.139.202` |
| `VPS_PORT` | `22` |
| `VPS_DEPLOY_ENABLED` | Leave unset until all setup steps are complete |

Under environment `production`, add these **environment secrets**:

| Secret | Value |
| --- | --- |
| `VPS_SSH_KEY` | Complete contents of `~/.ssh/green_ridge_ci` (private key) |
| `VPS_KNOWN_HOSTS` | Verified SSH host-key line(s), including the host/IP |

To copy the private key directly into the GitHub secret field on the Mac:

```sh
pbcopy < ~/.ssh/green_ridge_ci
```

Obtain the server's Ed25519 fingerprint from the already verified admin SSH
session (or Hostinger console):

```sh
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

On the Mac, retrieve the host key and compare its fingerprint before trusting it:

```sh
ssh-keyscan -t ed25519 187.124.139.202 > /tmp/green-ridge-known-hosts
ssh-keygen -lf /tmp/green-ridge-known-hosts
```

Only if it matches the server's fingerprint:

```sh
pbcopy < /tmp/green-ridge-known-hosts
```

Paste that into `VPS_KNOWN_HOSTS`. Do not put just the `SHA256:...` fingerprint
there: SSH requires the full known_hosts line. The workflow enforces strict
host-key checking and never runs `ssh-keyscan` itself.

## 5. Enable and verify the first automatic deployment

Set repository variable `VPS_DEPLOY_ENABLED=true`, then run the workflow manually
on `main`. Future successful pushes to `main` will deploy automatically.

On the VPS, verify after the job succeeds:

```sh
sudo docker ps --filter label=com.docker.compose.project=green-ridge
sudo cat /var/lib/green-ridge-deploy/current-image
curl -I https://www.greenridgetechnics.com/id
```

The web image must match the digest in the publish job summary, its health should
be `healthy`, and HTTPS should return 200. Workflow configuration and local tests
alone do not prove that GitHub credentials or live deployment work.

## Failure, recovery, and maintenance

- Pull failures leave the current web container running. Failed application
  health checks or local HTTPS checks trigger rollback to the previous local
  image. The job still fails so the problem remains visible. Rollback failure
  is explicitly reported. Public HTTPS is checked again from GitHub afterward;
  failure of that external check reports a failed job without triggering another
  remote rollback (it may be an external routing problem).
- Deployment is serialized in GitHub and with a server-side lock. SIGTERM,
  SIGHUP, and ordinary errors after switching trigger recovery; power loss,
  SIGKILL, a stopped Docker daemon, or a full disk still require manual recovery.
  Replacement can cause a brief interruption; this is not a zero-downtime setup.
- To pause automatic deployment, set `VPS_DEPLOY_ENABLED=false`. Audit/build/test
  and publishing continue. A push alone cannot enable deployment without that
  variable and the environment secrets.
- After switching to CI, avoid `docker compose up --build` in `/opt/green-ridge`:
  it replaces the registry image with a local build. Normal application updates
  should use GitHub. Caddy configuration remains managed manually from that
  original checkout. After a Caddyfile change, use
  `sudo docker compose up -d --force-recreate --no-deps caddy` there.
- Changes to the root-owned deployment script or Compose file require an admin
  to reinstall them; the CI key cannot update its own permissions. Review then:

  ```sh
  cd /opt/green-ridge
  git pull --ff-only
  sudo install -o root -g root -m 755 deploy/ci-deploy.sh /usr/local/sbin/green-ridge-deploy
  sudo install -o root -g root -m 644 deploy/compose.ci.yaml /etc/green-ridge-ci/compose.yaml
  ```

- To recover the prior image manually as the administrator:

  ```sh
  sudo bash -c 'APP_IMAGE="$(cat /var/lib/green-ridge-deploy/previous-image)" docker compose --env-file /dev/null -p green-ridge -f /etc/green-ridge-ci/compose.yaml up -d --no-deps --wait --wait-timeout 180 web'
  ```

- Keep current and rollback images when cleaning disk space. Backup work was
  deferred; rollback images on the same VPS do not replace off-server backups.
- Canonical URL is `https://www.greenridgetechnics.com`, with indexing still
  disabled. Future domain/indexing changes must update both workflow build
  settings and the root-owned runtime Compose file.

## Local verification

```sh
bash -n deploy/setup-ci.sh deploy/ci-deploy.sh
APP_IMAGE=green-ridge:ci docker compose --env-file /dev/null -f deploy/compose.ci.yaml config --quiet
docker run --rm -e GRT_DEPLOY_TEST_CONTAINER=1 -v "$PWD:/workspace:ro" node:22-bookworm-slim node /workspace/tests/ci-deploy.test.mjs
```

The deployment tests run the actual shell script in a disposable container with
mock Docker/curl commands and no host Docker socket. They cover rejected input,
successful deployment, registry failure, failed health/TLS checks, and rollback
failure; the real network and authentication are verified during first setup.
