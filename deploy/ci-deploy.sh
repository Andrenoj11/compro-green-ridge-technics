#!/bin/bash
# Root-owned forced command. Input is ONE sha256 digest, never shell code.
set -euo pipefail
export PATH=/usr/sbin:/usr/bin:/sbin:/bin
export HOME=/root
export COMPOSE_IGNORE_ORPHANS=true
unset DOCKER_HOST DOCKER_CONTEXT DOCKER_CONFIG COMPOSE_FILE COMPOSE_PROJECT_NAME
umask 077

[[ $EUID -eq 0 && $# -eq 0 ]] || { echo 'Run the installed command as root without arguments.' >&2; exit 1; }
IFS= read -r -t 30 digest || { echo 'Expected an image digest on stdin.' >&2; exit 1; }
[[ "$digest" =~ ^sha256:[a-f0-9]{64}$ ]] || { echo 'Invalid image digest.' >&2; exit 1; }

readonly image="ghcr.io/andrenoj11/compro-green-ridge-technics@$digest"
readonly config=/etc/green-ridge-ci/compose.yaml
readonly state=/var/lib/green-ridge-deploy
cd /etc/green-ridge-ci
install -d -o root -g root -m 700 "$state"
exec 9>"$state/deploy.lock"
flock -w 300 9 || { echo 'Another deployment is still running.' >&2; exit 1; }

compose() {
  APP_IMAGE="$1" docker compose --env-file /dev/null -p green-ridge -f "$config" "${@:2}"
}

# Resolve the current running container before changing anything.
container=$(docker ps -q --filter label=com.docker.compose.project=green-ridge --filter label=com.docker.compose.service=web)
[[ "$container" =~ ^[a-f0-9]+$ ]] || { echo 'Expected exactly one running web container. Restore it manually first.' >&2; exit 1; }
previous_id=$(docker inspect --format '{{.Image}}' "$container")
[[ "$previous_id" =~ ^sha256:[a-f0-9]{64}$ ]] || exit 1
readonly previous="green-ridge:rollback-${previous_id#sha256:}"
docker image tag "$previous_id" "$previous"

# A registry/pull failure leaves the current application untouched.
docker pull "$image"
printf '%s\n' "$previous" > "$state/previous-image"
switched=false
rollback() {
  result=$?
  trap - EXIT HUP INT TERM
  if [[ "$switched" == true ]]; then
    echo 'Deployment failed; restoring the previous image.' >&2
    if compose "$previous" up -d --no-deps --wait --wait-timeout 180 web; then
      printf '%s\n' "$previous" > "$state/current-image"
      echo 'Previous image restored.' >&2
    else
      echo 'ROLLBACK FAILED. Inspect the web container from an administrator SSH session.' >&2
    fi
  fi
  exit "$result"
}
trap rollback EXIT
trap 'exit 130' INT
trap 'exit 143' HUP TERM
switched=true
compose "$image" up -d --no-deps --wait --wait-timeout 180 web
# Test local Caddy TLS + routing, independent of public DNS caches.
curl --fail --silent --show-error --retry 5 --retry-delay 3 --retry-all-errors \
  --connect-timeout 5 --max-time 15 \
  --resolve www.greenridgetechnics.com:443:127.0.0.1 \
  -o /dev/null https://www.greenridgetechnics.com/id
printf '%s\n' "$image" > "$state/current-image"
switched=false
trap - EXIT HUP INT TERM
printf 'Deployed %s\n' "$image"
