# Google Workspace SMTP relay and contact form

The site uses `smtp-relay.gmail.com:587`, requires STARTTLS, verifies Google's
certificate, and sends from/to `support@gr-tech.id`. Administrators can add internal
recipients through `CONTACT_RECIPIENTS` in the VPS environment file. Support is
always included; extra recipients receive BCC copies and are included in the SMTP
envelope. There are at most five unique recipients, all within `gr-tech.id`.
The visitor cannot choose recipients. The validated visitor
address is Reply-To. There is no automatic
visitor acknowledgement, attachment upload, HTML email or caller-selected target.
No Gmail login password or App Password is used by the application.

Sending is **disabled by default**. Without complete configuration the existing
local brief/copy/download/direct-email form remains available. A crafted API
request cannot enable sending. Activate only after the following setup.

## 1. Configure Google Workspace (administrator)

Open <https://admin.google.com> for **gr-tech.id**, then Apps → Google Workspace →
Gmail → Routing → **SMTP relay service**. Work at the top-level organization.
Create a dedicated rule named `Green Ridge Website VPS`:

- Allowed senders: **Only registered Apps users in my domains**.
- Authentication: check **Only accept mail from the specified IP addresses**.
  Add only `187.124.139.202` (one IPv4 /32), and enable that entry.
- Leave **Require SMTP Authentication** unchecked for this IP-authenticated setup.
- Check **Require TLS encryption**, then Save.

Confirm `support@gr-tech.id` is the actual Gmail-enabled, licensed Workspace
account. Do not select “Any addresses” or allow a broad IP range. The IP rule
trusts this VPS, so keep access to the VPS restricted. If its public outbound IP
changes, sending must fail until the allowlist is updated; do not broaden it.

Google says changes can take up to 24 hours, often less. Preserve the existing
Workspace MX/SPF/DKIM/DMARC setup for `gr-tech.id`; check authentication using a
received test message. This does not move mail hosting to the website's domain
`greenridgetechnics.com`, and does not require opening inbound SMTP ports.

Reference: [Google's SMTP relay guide](https://knowledge.workspace.google.com/admin/gmail/advanced/route-outgoing-smtp-relay-messages-through-google).

## 2. Create Cloudflare Turnstile widget

Use a Cloudflare account → Turnstile → Add widget, choose **Managed**, and allow
only `www.greenridgetechnics.com`. Do not allow arbitrary hostnames, localhost,
or test hosts on the production widget. Pre-clearance is not needed.
The widget action used by the code is `contact`.

Copy the **site key** and **secret key** into the VPS configuration below. Only
the site key is sent to the browser; the secret remains server-side. Production
rejects Cloudflare's known test/bypass keys. Never paste a secret in chat, Git,
Docker build arguments or a `NEXT_PUBLIC_` variable. The free Turnstile plan
supports this use; Hostinger DNS can stay in place.

References: [Plans](https://developers.cloudflare.com/turnstile/plans/),
[widget setup](https://developers.cloudflare.com/turnstile/get-started/widget-management/dashboard/),
[mandatory server verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## 3. Install reviewed changes on the VPS

First commit/push this implementation and wait for the normal Actions deployment
to succeed. Sending stays disabled, and the existing local brief is preserved.
Then run these commands **on the VPS as deploy**:

```sh
cd /opt/green-ridge
git pull --ff-only
sudo bash deploy/setup-contact.sh
```

The installer updates `/etc/green-ridge-ci/compose.yaml` and creates
`/etc/green-ridge-ci/contact.env` only if it doesn't already exist. It preserves
existing values and never reruns account setup. Root owns the environment file,
mode 600. It does not restart the website.

Apply the Caddy configuration so it overwrites the client IP header. Keep this
site directly behind Caddy (Hostinger DNS); adding another proxy later requires
reviewing trusted-proxy/IP handling:

```sh
sudo docker compose up -d --force-recreate --no-deps caddy
```

Edit the secret configuration in an editor, not in shell command arguments:

```sh
sudo nano /etc/green-ridge-ci/contact.env
```

```dotenv
CONTACT_ENABLED=true
CONTACT_RECIPIENTS=support@gr-tech.id
TURNSTILE_SITE_KEY=REPLACE_WITH_PRODUCTION_SITE_KEY
TURNSTILE_SECRET_KEY=REPLACE_WITH_PRODUCTION_SECRET_KEY
```

`CONTACT_RECIPIENTS` is an administrator-controlled comma-separated list of plain
email addresses. Add the approved internal addresses to this line in the VPS
editor. It defaults to support only when unset or empty; support is always
included even if omitted from a nonempty list. Duplicate addresses are normalized
and removed. Invalid addresses, control characters, external domains or more than
five total destinations disable sending until corrected. Do not put real staff
recipient lists in public repository templates or client-side variables.

Recreate only web using its currently deployed immutable image. No build:

```sh
sudo bash -c 'APP_IMAGE="$(cat /var/lib/green-ridge-deploy/current-image)" docker compose --env-file /dev/null -p green-ridge -f /etc/green-ridge-ci/compose.yaml up -d --no-deps --force-recreate --wait --wait-timeout 180 web'
```

The new image creates `/app/contact-state` as the non-root application user.
Compose mounts the persistent `green-ridge_contact_state` volume there. Install
the new image before mounting this volume for the first time so ownership is
initialized correctly. Do not delete this volume or use `down -v` during updates.
Never scale web above one replica with this file-backed store; use a transactional
shared store before adding processes/replicas. The current standalone server runs
one Node process. Root/Docker administrators can inspect environment values;
never share expanded Compose or `docker inspect` output containing secrets.

## 4. Verify and disable if needed

Open `/id/contact`, complete Turnstile, submit one inquiry using a visitor address
you control, and check `support@gr-tech.id` including spam. Verify From/To and
that Reply targets the visitor. SMTP acceptance means Google accepted the message,
not guaranteed inbox delivery. With additional recipients configured, verify each
mailbox receives the new test inquiry; changing recipients does not clear the
existing duplicate-send history. Partial SMTP acceptance is reported as uncertain,
with no automatic retry to already accepted recipients. Check Workspace Email Log Search for delivery
issues, relay policy, and outbound port 587 connectivity from the VPS.

An exact accepted inquiry repeated within 15 minutes returns success without
sending again. A reserved inquiry with uncertain delivery returns an error and
is not automatically resent. Avoid repeated real test submissions. No real Google
email is sent by automated tests; production relay and Turnstile still need this
manual verification.

To disable sending, set `CONTACT_ENABLED=false` in the root-owned environment file
and recreate web with the same command. The local brief fallback becomes available.
The absence of secrets, provider timeouts, disk errors, corrupted state, invalid
challenge, wrong hostname/action, and missing trusted IP header all block sending.
Generic errors deliberately omit SMTP responses, tokens and personal information.

## Security boundaries and limits

- Same-origin JSON only, consent required, strict field/service/token validation,
  honeypot, 16 KiB actual-body limit and a five-second body-read limit.
- Caddy also limits request bodies and **overwrites** `X-GRT-Client-IP` with the
  socket peer. Web port 3000 must remain unpublished; forwarding headers supplied
  by the visitor do not identify the client. IPv6 addresses are grouped by /64;
  IPv4-mapped IPv6 shares its IPv4 limit.
- Turnstile is always verified server-side, with an eight-second timeout, exact
  canonical hostname and `contact` action. Cloudflare rejects expired/replayed
  tokens. Verification failures or outages never bypass the challenge.
- At most two in-flight requests, ten requests per client network per 15 minutes,
  120 requests total per 15 minutes before provider calls. These request limits
  reset on restart. Durable send reservations allow three per client network and
  three per visitor email per 15 minutes, twenty total per rolling hour, and one
  hundred per rolling day. Failed/ambiguous SMTP attempts consume the send budget.
- Reservations are persisted atomically before SMTP, serialized within the one
  process, and retained across normal deployments/restarts. They store keyed
  hashes and counters, not message contents, raw IPs or plaintext visitor emails.
  Expired entries are pruned on the next store transaction. The file is bounded
  and mode 600; invalid state fails closed. This is not a message queue or a
  guarantee of exactly-once delivery during power loss or filesystem failure.
- No CAPTCHA/filter guarantees every accepted inquiry is legitimate. Monitor the
  support mailbox and provider errors; tune limits based on actual usage.

Privacy and consent text is localized in Indonesian, English, Arabic and Chinese,
including the use of Google Workspace and Cloudflare Turnstile. For local tests,
use dependency-injected fake providers; never enable production bypass keys.
