/**
 * Unit Tests — Retriever
 */

const MemoryStore = require('../../src/core/memory-store');
const Retriever = require('../../src/core/retriever');
const path = require('path');
const fs = require('fs');

const TEST_DIR = path.join(__dirname, '../tmp/retriever');

describe('Retriever', () => {
  let store, retriever;

  beforeEach(async () => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
    store = new MemoryStore({ dir: TEST_DIR });
    await store.init();
    retriever = new Retriever(store, { threshold: 0.3 });
  });

  afterEach(() => {
    if (fs.existsSync(TEST_DIR)) fs.rmSync(TEST_DIR, { recursive: true });
  });

  test('finds memories by keyword', async () => {
    await store.add({ type: 'fact', key: 'favorite language', value: 'JavaScript is my favorite language' });
    await store.add({ type: 'fact', key: 'hobby', value: 'I enjoy hiking on weekends' });
    const results = await retriever.findRelevant('what is my favorite language');
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].key).toBe('favorite language');
  });

  test('returns empty for no match', async () => {
    await store.add({ type: 'fact', key: 'color', value: 'blue' });
    const results = await retriever.findRelevant('quantum physics equations');
    expect(results).toHaveLength(0);
  });

  test('findByType filters correctly', async () => {
    await store.add({ type: 'fact', key: 'f1', value: 'v1' });
    await store.add({ type: 'preference', key: 'p1', value: 'v2' });
    const prefs = await retriever.findByType('preference');
    expect(prefs).toHaveLength(1);
  });

  test('cosine similarity works', () => {
    const a = [1, 0, 0];
    const b = [1, 0, 0];
    expect(retriever.cosineSimilarity(a, b)).toBe(1);
    const c = [0, 1, 0];
    expect(retriever.cosineSimilarity(a, c)).toBe(0);
  });
});
