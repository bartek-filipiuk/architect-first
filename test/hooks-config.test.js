const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const cfg = () => JSON.parse(fs.readFileSync(path.join(root, 'hooks/architect-hooks.json'), 'utf8'));

test('config wires the three lifecycle events', () => {
  const h = cfg().hooks;
  assert.ok(h.SessionStart, 'SessionStart missing');
  assert.ok(h.SubagentStart, 'SubagentStart missing');
  assert.ok(h.UserPromptSubmit, 'UserPromptSubmit missing');
});

test('every referenced hook script exists and timeout is bounded', () => {
  const json = JSON.stringify(cfg());
  for (const f of ['architect-activate.js', 'architect-mode-tracker.js']) {
    assert.ok(json.includes(f), `${f} not referenced`);
    assert.ok(fs.existsSync(path.join(root, 'hooks', f)), `${f} missing on disk`);
  }
  for (const t of json.matchAll(/"timeout":\s*(\d+)/g)) {
    assert.ok(Number(t[1]) <= 5, 'timeout must be <= 5s');
  }
});
