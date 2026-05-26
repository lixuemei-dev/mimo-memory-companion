/**
 * Tokenizer Utility — Token counting and text analysis
 * Approximate token counting for context budget management
 */

class Tokenizer {
  constructor(options = {}) {
    this.approxCharsPerToken = options.approxCharsPerToken || 4;
  }

  count(text) {
    if (!text) return 0;
    return Math.ceil(text.length / this.approxCharsPerToken);
  }

  truncate(text, maxTokens) {
    const maxChars = maxTokens * this.approxCharsPerToken;
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars - 3) + '...';
  }

  splitChunks(text, chunkSize = 500) {
    const chars = chunkSize * this.approxCharsPerToken;
    const chunks = [];
    for (let i = 0; i < text.length; i += chars) {
      chunks.push(text.slice(i, i + chars));
    }
    return chunks;
  }

  estimateCost(text, pricePer1k = 0.001) {
    const tokens = this.count(text);
    return (tokens / 1000) * pricePer1k;
  }
}

module.exports = Tokenizer;
