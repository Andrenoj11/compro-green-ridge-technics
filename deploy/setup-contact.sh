#!/bin/bash
# After the new application image is deployed, run as the VPS administrator.
set -euo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
[[ $EUID -eq 0 && $# -eq 0 ]] || { echo 'Run with sudo and no arguments.' >&2; exit 1; }
readonly source_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
[[ -f /etc/green-ridge-ci/compose.yaml ]] || { echo 'Set up CI deployment first.' >&2; exit 1; }
install -o root -g root -m 644 "$source_dir/compose.ci.yaml" /etc/green-ridge-ci/compose.yaml
if [[ ! -e /etc/green-ridge-ci/contact.env ]]; then
  install -o root -g root -m 600 "$source_dir/contact.env.example" /etc/green-ridge-ci/contact.env
fi
chown root:root /etc/green-ridge-ci/contact.env
chmod 600 /etc/green-ridge-ci/contact.env
APP_IMAGE=green-ridge:validation docker compose --env-file /dev/null -p green-ridge -f /etc/green-ridge-ci/compose.yaml config --quiet
echo 'Contact Compose config installed; existing contact.env preserved. No containers restarted.'
echo 'Follow deploy/SMTP.md to configure relay/Turnstile, update Caddy and activate sending.'
