/**
 * Injector — Builds context prompts from retrieved memories
 * Formats and injects memory content into LLM prompts
 */

const Tokenizer = require('../utils/tokenizer');

class Injector {
  constructor(options = {}) {
    this.maxTokens = options.maxTokens || 2000;
    this.format = options.format || 'natural';
    this.tokenizer = new Tokenizer();
  }

  buildContext(memories) {
    if (!memories || memories.length === 0) return '';
    const sorted = this.prioritize(memories);
    const selected = this.fitBudget(sorted);
    return this.format === 'structured'
      ? this.formatStructured(selected)
      : this.formatNatural(selected);
  }

  prioritize(memories) {
    return [...memories].sort((a, b) => {
      const scoreA = (a.score || 0) * (a.decayFactor || 1) * (a.importance || 0.5);
      const scoreB = (b.score || 0) * (b.decayFactor || 1) * (b.importance || 0.5);
      return scoreB - scoreA;
    });
  }

  fitBudget(memories) {
    let tokens = 0;
    const result = [];
    for (const m of memories) {
      const t = this.tokenizer.count(m.value);
      if (tokens + t > this.maxTokens) break;
      tokens += t;
      result.push(m);
    }
    return result;
  }

  formatNatural(memories) {
    const lines = memories.map(m => `- [${m.type}] ${m.key}: ${m.value}`);
    return `Relevant memories from past conversations:\n${lines.join('\n')}`;
  }

  formatStructured(memories) {
    const byType = {};
    memories.forEach(m => {
      if (!byType[m.type]) byType[m.type] = [];
      byType[m.type].push(m);
    });
    let result = '<memories>\n';
    for (const [type, items] of Object.entries(byType)) {
      result += `<type name="${type}">\n`;
      items.forEach(m => { result += `  <memory key="${m.key}">${m.value}</memory>\n`; });
      result += '</type>\n';
    }
    result += '</memories>';
    return result;
  }
}

module.exports = Injector;
