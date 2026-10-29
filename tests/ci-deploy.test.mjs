// Run only with the documented disposable Docker command; no Docker socket mounted.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import test, { beforeEach } from 'node:test';

if (process.env.GRT_DEPLOY_TEST_CONTAINER !== '1' || process.platform !== 'linux' || process.getuid() !== 0) {
  throw new Error('Run these tests inside the disposable Node Docker container.');
}
for (const command of ['docker', 'curl']) {
  fs.copyFileSync('/workspace/tests/fixtures/deploy-runtime.mjs', `/usr/bin/${command}`);
  fs.chmodSync(`/usr/bin/${command}`, 0o755);
}
fs.mkdirSync('/etc/green-ridge-ci', { recursive: true });
fs.mkdirSync('/run/lock', { recursive: true });
const digest = `sha256:${'b'.repeat(64)}`;
const image = `ghcr.io/andrenoj11/compro-green-ridge-technics@${digest}`;
const previous = `green-ridge:rollback-${'a'.repeat(64)}`;
const run = (input = digest, args = []) => spawnSync('/bin/bash', ['/workspace/deploy/ci-deploy.sh', ...args], {
  input: input + '\n', encoding: 'utf8', timeout: 10000,
});
const log = () => fs.readFileSync('/tmp/deploy-test-log', 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
beforeEach(() => {
  fs.writeFileSync('/tmp/deploy-test-mode', 'success');
  fs.writeFileSync('/tmp/deploy-test-log', '');
  fs.rmSync('/var/lib/green-ridge-deploy', { recursive: true, force: true });
});

test('invalid references and shell payloads are rejected before Docker is called', () => {
  for (const value of ['latest', 'ghcr.io/other/project@' + digest, digest + '; touch /tmp/grt-injected', 'sha256:abc']) {
    assert.notEqual(run(value).status, 0);
  }
  assert.deepEqual(log(), []);
  assert.equal(fs.existsSync('/tmp/grt-injected'), false);
});
test('command arguments are rejected', () => {
  assert.notEqual(run(digest, ['anything']).status, 0);
  assert.deepEqual(log(), []);
});
test('successful deployment uses fixed repository and persists recovery references', () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(log().find(e => e.args[0] === 'pull').args, ['pull', image]);
  const deployments = log().filter(e => e.args[0] === 'compose');
  assert.equal(deployments.length, 1);
  assert.equal(deployments[0].image, image);
  assert.ok(deployments[0].args.includes('--no-deps'));
  assert.equal(log().at(-1).command, 'curl');
  assert.equal(fs.readFileSync('/var/lib/green-ridge-deploy/current-image', 'utf8').trim(), image);
  assert.equal(fs.readFileSync('/var/lib/green-ridge-deploy/previous-image', 'utf8').trim(), previous);
});
test('registry failure does not replace the running container', () => {
  fs.writeFileSync('/tmp/deploy-test-mode', 'pull-failure');
  assert.notEqual(run().status, 0);
  assert.equal(log().filter(e => e.args[0] === 'compose').length, 0);
});
for (const mode of ['unhealthy', 'https-failure']) {
  test(`${mode} restores previous image and still reports failure to CI`, () => {
    fs.writeFileSync('/tmp/deploy-test-mode', mode);
    const result = run();
    assert.notEqual(result.status, 0);
    assert.deepEqual(log().filter(e => e.args[0] === 'compose').map(e => e.image), [image, previous]);
    assert.equal(fs.readFileSync('/var/lib/green-ridge-deploy/current-image', 'utf8').trim(), previous);
    assert.match(result.stderr, /Previous image restored/);
  });
}
test('failed rollback is reported explicitly', () => {
  fs.writeFileSync('/tmp/deploy-test-mode', 'rollback-failure');
  const result = run();
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /ROLLBACK FAILED/);
});
