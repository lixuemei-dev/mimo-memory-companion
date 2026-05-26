/**
 * Integration Tests — CLI commands
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const TEST_DIR = path.join(__dirname, '../tmp/cli');
const CLI_PATH = path.join(__dirname, '../../src/cli.js');

describe('CLI Integration', () => {
  beforeAll(() => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
    fs.mkdirSync(TEST_DIR, { recursive: true });
  });

  afterAll(() => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
  });

  test('init command works', () => {
    const output = execSync(`node ${CLI_PATH} init --dir ${TEST_DIR}`, { encoding: 'utf-8' });
    expect(output).toContain('initialized');
  });

  test('store command works', () => {
    const output = execSync(
      `node ${CLI_PATH} store --dir ${TEST_DIR} --type fact --key test --value hello`,
      { encoding: 'utf-8' }
    );
    expect(output).toContain('Stored');
  });

  test('list command shows memories', () => {
    const output = execSync(`node ${CLI_PATH} list --dir ${TEST_DIR}`, { encoding: 'utf-8' });
    expect(output).toContain('Total memories');
  });

  test('stats command returns data', () => {
    const output = execSync(`node ${CLI_PATH} stats --dir ${TEST_DIR}`, { encoding: 'utf-8' });
    expect(output).toContain('Stats');
  });

  test('help shows usage', () => {
    const output = execSync(`node ${CLI_PATH} help`, { encoding: 'utf-8' });
    expect(output).toContain('Usage');
  });
});
