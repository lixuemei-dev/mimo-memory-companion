/**
 * Recall Accuracy Analyzer
 * Measures retrieval precision, recall, and F1 score
 */

class RecallAccuracyAnalyzer {
  constructor(retriever) {
    this.retriever = retriever;
    this.results = [];
  }

  async evaluate(testCase) {
    const retrieved = await this.retriever.findRelevant(testCase.query);
    const retrievedIds = new Set(retrieved.map(r => r.id));
    const expectedIds = new Set(testCase.expected);

    const tp = [...expectedIds].filter(id => retrievedIds.has(id)).length;
    const fp = [...retrievedIds].filter(id => !expectedIds.has(id)).length;
    const fn = [...expectedIds].filter(id => !retrievedIds.has(id)).length;

    const precision = tp / (tp + fp) || 0;
    const recall = tp / (tp + fn) || 0;
    const f1 = precision + recall > 0 ? 2 * precision * recall / (precision + recall) : 0;

    const result = {
      query: testCase.query,
      precision: Math.round(precision * 100) / 100,
      recall: Math.round(recall * 100) / 100,
      f1: Math.round(f1 * 100) / 100,
      retrieved: retrieved.length,
      expected: testCase.expected.length,
    };
    this.results.push(result);
    return result;
  }

  summary() {
    if (this.results.length === 0) return { avgPrecision: 0, avgRecall: 0, avgF1: 0 };
    const n = this.results.length;
    return {
      avgPrecision: Math.round(this.results.reduce((s,r) => s+r.precision, 0) / n * 100) / 100,
      avgRecall: Math.round(this.results.reduce((s,r) => s+r.recall, 0) / n * 100) / 100,
      avgF1: Math.round(this.results.reduce((s,r) => s+r.f1, 0) / n * 100) / 100,
      totalTests: n,
    };
  }
}

module.exports = RecallAccuracyAnalyzer;
