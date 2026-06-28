const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');

test('plugin.json is valid and complete', () => {
  const pj = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/plugin.json'), 'utf8'));
  assert.strictEqual(pj.name, 'architect-first');
  assert.ok(typeof pj.version === 'string' && pj.version.length > 0);
  assert.ok(typeof pj.description === 'string' && pj.description.length > 0);
  assert.strictEqual(pj.hooks, './hooks/architect-hooks.json');
});

test('package.json exposes node --test', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  assert.match(pkg.scripts.test, /node --test/);
});
