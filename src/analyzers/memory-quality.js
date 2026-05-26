/**
 * Memory Quality Analyzer
 * Evaluates stored memories for relevance, freshness, and usefulness
 */

class MemoryQualityAnalyzer {
  constructor(store) {
    this.store = store;
  }

  async analyze(memory) {
    const freshness = this.freshnessScore(memory);
    const relevance = this.relevanceScore(memory);
    const completeness = this.completenessScore(memory);
    const score = (freshness * 0.3 + relevance * 0.4 + completeness * 0.3);

    return {
      memoryId: memory.id,
      score: Math.round(score * 100) / 100,
      freshness: Math.round(freshness * 100) / 100,
      relevance: Math.round(relevance * 100) / 100,
      completeness: Math.round(completeness * 100) / 100,
      recommendation: score < 0.3 ? 'consider_pruning' : 'keep',
    };
  }

  freshnessScore(memory) {
    const age = Date.now() - memory.createdAt;
    const dayMs = 86400000;
    return Math.max(0, 1 - age / (dayMs * 30));
  }

  relevanceScore(memory) {
    let score = 0.5;
    if (memory.accessCount > 5) score += 0.3;
    if (memory.accessCount > 0) score += 0.1;
    if (memory.embedding) score += 0.1;
    return Math.min(score, 1.0);
  }

  completenessScore(memory) {
    let score = 0;
    if (memory.key) score += 0.4;
    if (memory.value && memory.value.length > 5) score += 0.4;
    if (memory.type) score += 0.2;
    return score;
  }

  async analyzeAll() {
    const memories = await this.store.list();
    return Promise.all(memories.map(m => this.analyze(m)));
  }
}

module.exports = MemoryQualityAnalyzer;
