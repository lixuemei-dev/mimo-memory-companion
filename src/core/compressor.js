/**
 * Compressor — Extracts and compresses memories from responses
 * Uses heuristics to identify valuable information worth storing
 */

const Tokenizer = require('../utils/tokenizer');

class Compressor {
  constructor(options = {}) {
    this.targetRatio = options.targetRatio || 0.3;
    this.tokenizer = new Tokenizer();
    this.minImportance = options.minImportance || 0.5;
  }

  async extract(text) {
    const sentences = this.splitSentences(text);
    const important = sentences.filter(s => this.importance(s) >= this.minImportance);
    return important.map(s => ({
      type: this.classifyType(s),
      key: this.extractKey(s),
      value: s.trim(),
      importance: this.importance(s),
      compressed: this.compress(s),
    }));
  }

  splitSentences(text) {
    return text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  }

  importance(sentence) {
    const signals = ['important', 'remember', 'always', 'never', 'key', 'critical', 'note'];
    let score = 0.3;
    signals.forEach(s => { if (sentence.toLowerCase().includes(s)) score += 0.15; });
    if (sentence.length > 50) score += 0.1;
    return Math.min(score, 1.0);
  }

  classifyType(sentence) {
    const lower = sentence.toLowerCase();
    if (lower.includes('prefer') || lower.includes('like') || lower.includes('dislike')) return 'preference';
    if (lower.includes('summary') || lower.includes('discussed')) return 'summary';
    return 'fact';
  }

  extractKey(sentence) {
    const words = sentence.trim().split(/\s+/).slice(0, 5);
    return words.join(' ').toLowerCase().replace(/[^a-z0-9\s]/g, '');
  }

  compress(sentence) {
    const words = sentence.trim().split(/\s+/);
    const target = Math.ceil(words.length * this.targetRatio);
    return words.slice(0, Math.max(target, 3)).join(' ');
  }
}

module.exports = Compressor;
