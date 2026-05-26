/**
 * Retriever — Finds relevant memories using similarity search
 * Supports vector similarity and keyword matching
 */

const Embeddings = require('../utils/embeddings');

class Retriever {
  constructor(store, options = {}) {
    this.store = store;
    this.topK = options.topK || 5;
    this.threshold = options.threshold || 0.7;
    this.embeddings = new Embeddings();
  }

  async findRelevant(query) {
    const queryEmbedding = await this.embeddings.encode(query);
    const memories = await this.store.list();

    const scored = memories.map(m => ({
      ...m,
      score: m.embedding
        ? this.cosineSimilarity(queryEmbedding, m.embedding)
        : this.keywordScore(query, m)
    }));

    return scored
      .filter(m => m.score >= this.threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, this.topK);
  }

  cosineSimilarity(a, b) {
    let dot = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }
    return normA && normB ? dot / (Math.sqrt(normA) * Math.sqrt(normB)) : 0;
  }

  keywordScore(query, memory) {
    const terms = query.toLowerCase().split(/\s+/);
    const text = `${memory.key} ${memory.value}`.toLowerCase();
    const matches = terms.filter(t => text.includes(t));
    return matches.length / terms.length;
  }

  async findByType(type, limit = 10) {
    const memories = await this.store.list({ type });
    return memories.slice(0, limit);
  }
}

module.exports = Retriever;
