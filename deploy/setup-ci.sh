#!/bin/bash
# Run manually as an administrator: sudo bash deploy/setup-ci.sh /path/to/key.pub
set -euo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
[[ $EUID -eq 0 && $# -eq 1 ]] || { echo 'Usage: sudo bash deploy/setup-ci.sh /path/to/key.pub' >&2; exit 1; }
readonly source_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly key_file="$1"
[[ -f "$key_file" ]] || { echo 'Public key file not found.' >&2; exit 1; }
ssh-keygen -lf "$key_file" >/dev/null
key=$(awk 'NF { print $1 " " $2 }' "$key_file")
[[ "$key" =~ ^ssh-ed25519\ [A-Za-z0-9+/=]+$ ]] || { echo 'Provide exactly one Ed25519 public key.' >&2; exit 1; }

# Fail rather than silently changing an account that already exists.
if id grt-ci >/dev/null 2>&1; then
  echo 'grt-ci already exists. This setup is one-time; review existing access before changing it.' >&2
  exit 1
fi
command -v docker >/dev/null
command -v flock >/dev/null
command -v curl >/dev/null
command -v visudo >/dev/null
container=$(docker ps -q --filter label=com.docker.compose.project=green-ridge --filter label=com.docker.compose.service=web)
[[ "$container" =~ ^[a-f0-9]+$ ]] || { echo 'The existing green-ridge web container must be running.' >&2; exit 1; }

install -d -m 755 /etc/green-ridge-ci
install -o root -g root -m 644 "$source_dir/compose.ci.yaml" /etc/green-ridge-ci/compose.yaml
install -o root -g root -m 755 "$source_dir/ci-deploy.sh" /usr/local/sbin/green-ridge-deploy
APP_IMAGE=green-ridge:validation docker compose --env-file /dev/null -p green-ridge -f /etc/green-ridge-ci/compose.yaml config --quiet

useradd --system --user-group --home-dir /var/lib/grt-ci --shell /bin/bash grt-ci
# root ownership prevents the CI account from changing its forced command.
install -d -o root -g root -m 755 /var/lib/grt-ci
install -d -o root -g root -m 755 /var/lib/grt-ci/.ssh
printf 'restrict,command="/usr/bin/sudo -n /usr/local/sbin/green-ridge-deploy" %s\n' "$key" > /var/lib/grt-ci/.ssh/authorized_keys
chown root:root /var/lib/grt-ci/.ssh/authorized_keys
chmod 644 /var/lib/grt-ci/.ssh/authorized_keys
sudoers_tmp=$(mktemp)
trap 'rm -f "$sudoers_tmp"' EXIT
printf 'grt-ci ALL=(root) NOPASSWD: /usr/local/sbin/green-ridge-deploy ""\n' > "$sudoers_tmp"
visudo -cf "$sudoers_tmp"
install -o root -g root -m 440 "$sudoers_tmp" /etc/sudoers.d/green-ridge-ci
echo 'CI access installed. Existing web and Caddy containers have not been restarted.'
