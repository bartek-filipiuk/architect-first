#!/usr/bin/env node
// UserPromptSubmit hook: detect `/architect <level>` and persist the chosen level.
// Never blocks the session — always exits 0.
const fs = require('node:fs');
const path = require('node:path');

const LEVELS = ['lite', 'full', 'ultra', 'off'];

function statePath() {
  const dir = process.env.ARCHITECT_STATE_DIR
    || process.env.CLAUDE_PROJECT_DIR
    || process.cwd();
  return path.join(dir, '.architect-level');
}

function parseLevel(prompt) {
  const m = /(?:^|\s)\/architect(?:-mode)?\s+(lite|full|ultra|off)\b/i.exec(prompt || '');
  return m ? m[1].toLowerCase() : null;
}

function main(input) {
  let prompt = '';
  try { prompt = JSON.parse(input || '{}').prompt || ''; } catch { /* ignore */ }
  const level = parseLevel(prompt);
  if (level && LEVELS.includes(level)) {
    try { fs.writeFileSync(statePath(), level, 'utf8'); } catch { /* ignore */ }
  }
}

if (require.main === module) {
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => { data += c; });
  process.stdin.on('end', () => { main(data); process.exit(0); });
  process.stdin.on('error', () => process.exit(0));
}

module.exports = { parseLevel, statePath, main, LEVELS };
