/**
 * Unit Tests — MemoryStore
 */

const MemoryStore = require('../../src/core/memory-store');
const path = require('path');
const fs = require('fs');

const TEST_DIR = path.join(__dirname, '../tmp/store');

describe('MemoryStore', () => {
  let store;

  beforeEach(async () => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
    store = new MemoryStore({ dir: TEST_DIR });
    await store.init();
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
  });

  test('initializes with empty store', async () => {
    expect(store.memories).toHaveLength(0);
  });

  test('adds and retrieves a memory', async () => {
    const mem = await store.add({ type: 'fact', key: 'test', value: 'hello' });
    expect(mem.id).toBeDefined();
    expect(mem.type).toBe('fact');
    const retrieved = await store.get(mem.id);
    expect(retrieved.key).toBe('test');
  });

  test('lists memories by type', async () => {
    await store.add({ type: 'fact', key: 'f1', value: 'v1' });
    await store.add({ type: 'preference', key: 'p1', value: 'v2' });
    const facts = await store.list({ type: 'fact' });
    expect(facts).toHaveLength(1);
  });

  test('removes a memory', async () => {
    const mem = await store.add({ type: 'fact', key: 'rm', value: 'x' });
    await store.remove(mem.id);
    const all = await store.list();
    expect(all).toHaveLength(0);
  });

  test('returns stats', async () => {
    await store.add({ type: 'fact', key: 'f1', value: 'v1' });
    await store.add({ type: 'fact', key: 'f2', value: 'v2' });
    const stats = await store.getStats();
    expect(stats.total).toBe(2);
    expect(stats.byType.fact).toBe(2);
  });

  test('garbage collect removes stale memories', async () => {
    const mem = await store.add({ type: 'fact', key: 'stale', value: 'old' });
    store.index.get(mem.id).decayFactor = 0.005;
    const cleaned = await store.garbageCollect();
    expect(cleaned).toBe(1);
  });
});
