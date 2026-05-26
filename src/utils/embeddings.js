/**
 * Embeddings Utility — Vector encoding and similarity operations
 * Supports local embeddings and external API fallback
 */

class Embeddings {
  constructor(options = {}) {
    this.dimension = options.dimension || 384;
    this.cache = new Map();
  }

  async encode(text) {
    const cacheKey = this.hash(text);
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    // Placeholder: real implementation would use a model
    // For now, generate deterministic hash-based embedding
    const embedding = this.hashEmbed(text);
    this.cache.set(cacheKey, embedding);
    return embedding;
  }

  hashEmbed(text) {
    let seed = 0;
    for (let i = 0; i < text.length; i++) {
      seed = ((seed << 5) - seed + text.charCodeAt(i)) | 0;
    }
    const rng = this.seededRandom(seed);
    return Array(this.dimension).fill(0).map(() => rng() * 2 - 1);
  }

  seededRandom(seed) {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return s / 2147483647;
    };
  }

  hash(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = ((h << 5) - h + text.charCodeAt(i)) | 0;
    }
    return h.toString(36);
  }

  cosineSimilarity(a, b) {
    let dot = 0, nA = 0, nB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i]; nA += a[i]*a[i]; nB += b[i]*b[i];
    }
    return nA && nB ? dot / (Math.sqrt(nA) * Math.sqrt(nB)) : 0;
  }
}

module.exports = Embeddings;
