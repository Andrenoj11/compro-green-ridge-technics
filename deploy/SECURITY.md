# Dependency security review — 29 October 2026

## Result

| Audit scope | Before | After |
| --- | --- | --- |
| All npm dependencies | 19 (1 critical, 11 high, 7 moderate) | 0 |
| Production npm dependencies | 3 (1 critical, 2 high) | 0 |

These are npm's vulnerable-package counts, not counts of successful attacks or
distinct CVEs. Reports are based on the advisories available on the review date.

## Changes

- Next.js and eslint-config-next: 16.3.5 to 16.4.3.
- React and React DOM: 19.3.0 to 19.3.1.
- Next.js's Sharp dependency resolves to 0.35.5, and source-map-js to 1.2.2.
- Removed unused Cloudflare/Vite/vinext preview tooling, the separate
  react-server-dom-webpack package, Drizzle, and the unused D1 examples.
  Historical `.openai/hosting.json` metadata is retained; no remote preview
  deployment was deleted or updated.
- Updated compatible transitive dependencies using npm 10 on Node 22, without
  `npm audit fix --force` or security overrides.

Next.js advisories included critical issues in image processing and cache
handling. The app does not currently declare `next/og`, `use cache`, or enable
`dangerouslyAllowSVG`; this does not justify retaining a vulnerable framework.
The production dependency audit also flagged Sharp and source-map-js.

Upstream references:

- https://github.com/advisories/GHSA-2464-fhr4-w9xw
- https://github.com/advisories/GHSA-673q-mjm6-r5xr
- https://github.com/advisories/GHSA-wq5f-xc86-pv6w

## Validation

- Clean `npm ci`, full `npm audit`, and `npm audit --omit=dev` passed on Node 22
  in Docker; both audits reported zero vulnerabilities.
- Production image built successfully on Linux ARM64 (the local Docker host).
- ESLint and TypeScript checks passed.
- All 11 integration tests passed against the production container: 68 localized
  pages, metadata, sitemap/robots, assets, hidden routes, local image optimization,
  and rejection of remote image URLs.
- GitHub workflow and Dependabot YAML parsed successfully. Hosted GitHub jobs
  have not run locally; the workflow validates the native x86 build on GitHub.

## Ongoing checks

`.github/workflows/security.yml` audits the complete dependency tree, lints,
builds Docker, and tests its production container on pushes to main, pull requests,
manual dispatch, and weekly schedules. Actions are pinned to commit SHAs; the
workflow has read-only repository access, no deployment secrets, and no deploy
step. Any reported severity fails the audit step. Configure branch protection
to require its `verify` check if merges should be blocked automatically.

Dependabot is configured for weekly npm, Dockerfile, and GitHub Actions updates.
Updates require review and merge; they do not automatically deploy to the VPS.
Enable Dependabot alerts/security updates in repository settings if not already
enabled. Monitor the workflow failures and update PRs.

## Apply to the VPS

Commit and push these changes first. As `deploy` on the VPS:

```sh
cd /opt/green-ridge
git pull --ff-only
sudo docker compose build --pull
sudo docker compose up -d --wait --wait-timeout 180
sudo docker compose exec web node -p "require('next/package.json').version"
sudo docker compose ps
curl -I https://www.greenridgetechnics.com/id
```

Expected Next.js version: `16.4.3`; the web container should be healthy and the
public page should return HTTP 200. Existing `.env`, Caddy certificates, and
Google Workspace DNS settings are unchanged. Keep the previous release reference
for recovery, but do not treat reverting to the vulnerable release as a permanent
fix. This patch does not enable public search indexing.

## Scope and limits

Zero npm audit findings means no known matching npm advisories were reported;
it is not a guarantee of complete security. This review did not scan OS packages
in the image, audit the live VPS configuration, investigate intrusion, or change
SSH settings. Pull/rebuild maintained base images, apply Ubuntu security updates,
and maintain backups separately. The running VPS remains on its old dependencies
until the deployment above succeeds.
