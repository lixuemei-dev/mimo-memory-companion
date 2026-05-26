/**
 * Integration Tests — Session lifecycle
 */

const MiMoMemoryCompanion = require('../../src/index');
const path = require('path');
const fs = require('fs');

const TEST_DIR = path.join(__dirname, '../tmp/session');

describe('Session Integration', () => {
  let companion;

  beforeEach(async () => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
    companion = new MiMoMemoryCompanion({
      store: { dir: TEST_DIR },
      retrieval: { threshold: 0.3 }
    });
    await companion.init();
  });

  afterEach(async () => {
    await companion.shutdown();
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
  });

  test('full session lifecycle: store and recall', async () => {
    const stored = await companion.store.add({
      type: 'fact', key: 'user_name', value: 'Alice'
    });
    expect(stored.id).toBeDefined();

    const { memories } = await companion.processUserMessage('what is my name');
    expect(memories.length).toBeGreaterThan(0);
  });

  test('process response and extract memories', async () => {
    const extracted = await companion.processAssistantResponse(
      'Important: the project deadline is March 15. Remember this date.'
    );
    expect(extracted.length).toBeGreaterThan(0);
  });

  test('shutdown flushes store', async () => {
    await companion.store.add({ type: 'fact', key: 'k', value: 'v' });
    await companion.shutdown();
    const files = fs.readdirSync(TEST_DIR).filter(f => f.endsWith('.json'));
    expect(files.length).toBeGreaterThan(0);
  });
});
