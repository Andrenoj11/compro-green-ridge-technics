# Hostinger VPS deployment

This configuration runs the Next.js standalone server as the non-root `node`
user behind Caddy. Only Caddy publishes host ports (TCP 80 and 443). Docker
published ports can bypass UFW, so do not add a public port mapping to `web`.
Caddy certificate state persists in named volumes; container logs are rotated.
No database or email sending service is configured yet.

## First deployment

Prerequisites: Docker Engine and Compose installed; SSH access verified; TCP
80/443 reachable through the VPS and any Hostinger firewall. Point the chosen
hostname's DNS A record to the VPS IPv4. Only use an AAAA record if it points to
this VPS's working IPv6. Preserve Google Workspace MX, SPF, DKIM, and DMARC
records. Do not change nameservers just to deploy the website.

The deployment files must be committed and pushed to GitHub before cloning
them on the VPS. These steps are run as `deploy` on the VPS:

```sh
sudo apt install -y git
sudo install -d -o deploy -g deploy /opt/green-ridge
git clone https://github.com/Andrenoj11/compro-green-ridge-technics.git /opt/green-ridge
cd /opt/green-ridge
cp deploy/.env.example .env
chmod 600 .env
nano .env
```

Set `SITE_DOMAIN` to the apex hostname, without `www`, `https://` or a path (default:
`greenridgetechnics.com`). Point `www` to that hostname with a CNAME record;
Caddy serves `www` and redirects the apex domain to `www` with HTTP 308,
preserving the request path and query. Compose sets the canonical origin to
`https://www.${SITE_DOMAIN}` at build time and runtime.
Keep `SITE_INDEXABLE=false` while
content approval is pending. Both values are passed at build time and runtime.

```sh
sudo docker compose config --quiet
sudo docker compose up -d --build --wait --wait-timeout 180
sudo docker compose ps
sudo docker compose logs --tail=80 web caddy
```

Open `https://www.YOUR_DOMAIN/id` and verify images and the other language routes.
Caddy automatically requests HTTPS certificates once DNS and ports are ready.
Container readiness alone does not verify that public HTTPS works.

## Updates and recovery

For automated deployments, follow [CI-CD.md](CI-CD.md). The instructions below
apply to the initial manual deployment only; after enabling CI, use the tested
registry images instead of rebuilding on the VPS.

Record the current commit before updating, then pull and rebuild:

```sh
git rev-parse HEAD
git pull --ff-only
sudo docker compose up -d --build --wait --wait-timeout 180
sudo docker compose up -d --force-recreate --no-deps caddy
```

Recreate Caddy after updating its bind-mounted configuration. Git can replace
the file inode, leaving a running container mounted to the previous file.

There may be a short interruption while the web container is replaced. If an
update fails, inspect logs, then restore the previously recorded commit and
rebuild; automatic rollback is not configured. A healthcheck marks a failing
container unhealthy but does not restart it automatically unless its process
exits. Rebuild after changing the domain or indexing setting.

Keep a secure off-server copy of `.env` and the Caddy data volume. Do not run
`docker compose down -v` during routine maintenance: it removes named volumes,
including HTTPS certificate state. Source is backed up in GitHub; no form
submissions are currently stored by the application.
