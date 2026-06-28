const test = require('node:test');
const assert = require('node:assert');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const root = path.join(__dirname, '..');
const r = (p) => path.join(root, p);

test('all required files exist', () => {
  const required = [
    '.claude-plugin/plugin.json', 'package.json', 'AGENTS.md', 'README.md',
    'hooks/architect-hooks.json', 'hooks/architect-activate.js', 'hooks/architect-mode-tracker.js',
    'philosophy/principles.md',
    'commands/architect.md', 'commands/architect-plan.md',
    'commands/architect-review.md', 'commands/architect-help.md',
  ];
  for (const f of required) assert.ok(fs.existsSync(r(f)), `missing ${f}`);
  assert.strictEqual(fs.readdirSync(r('philosophy/architects')).filter(f => f.endsWith('.md')).length, 12);
});

test('all JSON parses and commands are valid .md (Claude Code loads .md, not .toml)', () => {
  for (const f of ['.claude-plugin/plugin.json', 'package.json', 'hooks/architect-hooks.json']) {
    JSON.parse(fs.readFileSync(r(f), 'utf8'));
  }
  for (const f of fs.readdirSync(r('commands'))) {
    assert.ok(f.endsWith('.md'), `${f} must be a .md command — Claude Code does not load .toml commands`);
    const s = fs.readFileSync(r(path.join('commands', f)), 'utf8');
    assert.match(s, /^description:/m, `${f} missing frontmatter description:`);
    const body = s.replace(/^---[\s\S]*?\n---\n/, '').trim();
    assert.ok(body.length > 0, `${f} has no prompt body`);
  }
});

test('AGENTS.md has all 6 rungs + safety boundaries', () => {
  const s = fs.readFileSync(r('AGENTS.md'), 'utf8');
  for (const kw of ['UNDERSTAND', 'YAGNI', 'REUSE', 'NATIVE', 'COST', 'DIRECTION', 'MINIMUM']) {
    assert.match(s, new RegExp(kw), `AGENTS.md missing ${kw}`);
  }
  assert.match(s, /Safety Boundaries/i);
});

test('SECURITY: hooks run cleanly (exit 0) and emit no env secrets', () => {
  const stateDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-gate-'));
  const env = { ...process.env, ARCHITECT_STATE_DIR: stateDir, SECRET_CANARY: 'do-not-leak' };
  const act = execFileSync('node', [r('hooks/architect-activate.js')], { env, encoding: 'utf8' });
  assert.ok(!act.includes('do-not-leak'), 'activate leaked an env var');
  assert.ok(!act.includes('SECRET_CANARY'), 'activate leaked an env KEY');
  assert.ok(act.includes('ARCHITECT-FIRST MODE ACTIVE'));
  // mode-tracker consumes stdin and must exit 0 even on junk
  const track = execFileSync('node', [r('hooks/architect-mode-tracker.js')], { env, input: 'not-json', encoding: 'utf8' });
  assert.ok(!track.includes('do-not-leak'), 'mode-tracker leaked an env var');
  assert.ok(!track.includes('SECRET_CANARY'), 'mode-tracker leaked an env KEY');
});

test('SECURITY: hooks declare no external dependencies', () => {
  for (const f of ['architect-activate.js', 'architect-mode-tracker.js']) {
    const s = fs.readFileSync(r(path.join('hooks', f)), 'utf8');
    for (const m of s.matchAll(/require\(['"]([^'"]+)['"]\)/g)) {
      assert.ok(m[1].startsWith('node:'), `${f} requires non-builtin ${m[1]}`);
    }
  }
});
