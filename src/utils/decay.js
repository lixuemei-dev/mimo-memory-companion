/**
 * Decay Utility — Time-based memory decay scoring
 * Memories lose relevance over time, boosted by access patterns
 */

class Decay {
  constructor(options = {}) {
    this.halfLife = options.halfLife || 7 * 24 * 60 * 60 * 1000; // 7 days
    this.accessBoost = options.accessBoost || 0.15;
  }

  calculate(memory) {
    const age = Date.now() - memory.createdAt;
    const timeDecay = Math.exp(-0.693 * age / this.halfLife);
    const accessBoost = Math.min(memory.accessCount * this.accessBoost, 1.0);
    const freshness = timeDecay * (1 + accessBoost);
    return Math.min(Math.max(freshness, 0), 1);
  }

  apply(memories) {
    return memories.map(m => ({
      ...m,
      decayFactor: this.calculate(m),
    }));
  }

  getStaleThreshold() {
    return 0.1;
  }

  estimateRemainingLife(memory) {
    const current = this.calculate(memory);
    const daysToThreshold = -Math.log(this.getStaleThreshold() / current) * this.halfLife / 0.693;
    return Math.max(0, Math.round(daysToThreshold / 86400000));
  }
}

module.exports = Decay;
