const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-mode-'));
process.env.ARCHITECT_STATE_DIR = stateDir;
const { parseLevel, statePath, main } = require('../hooks/architect-mode-tracker.js');

test('parseLevel extracts a valid level', () => {
  assert.strictEqual(parseLevel('please /architect ultra now'), 'ultra');
  assert.strictEqual(parseLevel('/architect-mode lite'), 'lite');
  assert.strictEqual(parseLevel('/architect OFF'), 'off');
  assert.strictEqual(parseLevel('/architect-first:architect ultra'), 'ultra');
});

test('parseLevel ignores prompts without the command', () => {
  assert.strictEqual(parseLevel('just write some code'), null);
  assert.strictEqual(parseLevel('/architect-review this diff'), null);
});

test('main persists the level from a UserPromptSubmit payload', () => {
  main(JSON.stringify({ prompt: '/architect ultra' }));
  assert.strictEqual(fs.readFileSync(statePath(), 'utf8').trim(), 'ultra');
});

test('main is a no-op on malformed input (never throws)', () => {
  assert.doesNotThrow(() => main('not json'));
});
