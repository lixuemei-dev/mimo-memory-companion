/**
 * Unit Tests — Decay Utility
 */

const Decay = require('../../src/utils/decay');

describe('Decay', () => {
  let decay;

  beforeEach(() => {
    decay = new Decay({ halfLife: 7 * 24 * 60 * 60 * 1000 });
  });

  test('fresh memory has high decay factor', () => {
    const mem = { createdAt: Date.now(), accessCount: 0 };
    const score = decay.calculate(mem);
    expect(score).toBeGreaterThan(0.9);
  });

  test('old memory has lower decay factor', () => {
    const mem = { createdAt: Date.now() - 30 * 86400000, accessCount: 0 };
    const score = decay.calculate(mem);
    expect(score).toBeLessThan(0.5);
  });

  test('access count boosts decay factor', () => {
    const now = Date.now();
    const fresh = { createdAt: now, accessCount: 0 };
    const accessed = { createdAt: now, accessCount: 10 };
    expect(decay.calculate(accessed)).toBeGreaterThan(decay.calculate(fresh));
  });

  test('apply modifies memories', () => {
    const mems = [
      { id: '1', createdAt: Date.now(), accessCount: 0 },
      { id: '2', createdAt: Date.now() - 30*86400000, accessCount: 0 },
    ];
    const result = decay.apply(mems);
    expect(result[0].decayFactor).toBeGreaterThan(result[1].decayFactor);
  });

  test('stale threshold is 0.1', () => {
    expect(decay.getStaleThreshold()).toBe(0.1);
  });
});
