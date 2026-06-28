const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-act-'));
process.env.ARCHITECT_STATE_DIR = stateDir;
const { readLevel, render, statePath } = require('../hooks/architect-activate.js');

test('readLevel defaults to full when no state file', () => {
  assert.strictEqual(readLevel(), 'full');
});

test('readLevel reads a persisted level', () => {
  fs.writeFileSync(statePath(), 'ultra', 'utf8');
  assert.strictEqual(readLevel(), 'ultra');
});

test('render(full) contains the activation marker and all 6 rungs', () => {
  const out = render('full');
  assert.match(out, /ARCHITECT-FIRST MODE ACTIVE/);
  for (const kw of ['UNDERSTAND', 'YAGNI', 'REUSE', 'NATIVE', 'COST', 'DIRECTION', 'MINIMUM']) {
    assert.match(out, new RegExp(kw));
  }
});

test('render(off) is empty', () => {
  assert.strictEqual(render('off'), '');
});

test('render(ultra) adds the aggressive-audit note', () => {
  assert.match(render('ultra'), /ultra/i);
});
