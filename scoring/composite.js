/**
 * Composite Scorer — Combines multiple metrics into a single score
 */

const weights = require('./weights.json');

class CompositeScorer {
  constructor(options = {}) {
    this.weights = options.weights || weights.weights;
    this.thresholds = options.thresholds || weights.thresholds;
  }

  score(metrics) {
    const weighted = {};
    let total = 0;

    for (const [metric, weight] of Object.entries(this.weights)) {
      const value = metrics[metric] || 0;
      weighted[metric] = value * weight;
      total += weighted[metric];
    }

    // Apply penalties
    if (metrics.latency > 500) total += weights.penalties.highLatency;
    if (metrics.recallAccuracy < 0.5) total += weights.penalties.lowRecall;
    if (metrics.tokenEfficiency < 0.3) total += weights.penalties.excessiveTokens;

    // Apply bonuses
    if (metrics.compressionEfficiency > 0.8) total += weights.bonuses.highCompression;
    if (metrics.latency < 100) total += weights.bonuses.fastResponse;

    return {
      score: Math.round(Math.min(Math.max(total, 0), 1) * 100) / 100,
      grade: this.getGrade(total),
      breakdown: weighted,
    };
  }

  getGrade(score) {
    if (score >= this.thresholds.excellent) return 'A+';
    if (score >= this.thresholds.good) return 'A';
    if (score >= this.thresholds.acceptable) return 'B';
    if (score >= this.thresholds.poor) return 'C';
    return 'D';
  }

  compare(resultA, resultB) {
    return {
      winner: resultA.score >= resultB.score ? 'A' : 'B',
      difference: Math.abs(resultA.score - resultB.score),
      grades: { a: resultA.grade, b: resultB.grade },
    };
  }
}

module.exports = CompositeScorer;
