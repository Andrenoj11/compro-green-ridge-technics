#!/usr/local/bin/node
// Fake external commands used only inside the disposable deployment-test container.
import fs from 'node:fs';
import path from 'node:path';
const command = path.basename(process.argv[1]);
const args = process.argv.slice(2);
const mode = fs.readFileSync('/tmp/deploy-test-mode', 'utf8');
fs.appendFileSync('/tmp/deploy-test-log', JSON.stringify({ command, args, image: process.env.APP_IMAGE }) + '\n');
if (command === 'curl') process.exit(mode === 'https-failure' ? 22 : 0);
if (args[0] === 'ps') console.log('abc123');
if (args[0] === 'inspect') console.log(`sha256:${'a'.repeat(64)}`);
if (args[0] === 'pull' && mode === 'pull-failure') process.exit(1);
if (args[0] === 'compose') {
  if (mode === 'rollback-failure') process.exit(1);
  if (mode === 'unhealthy' && !process.env.APP_IMAGE.startsWith('green-ridge:rollback-')) process.exit(1);
}
