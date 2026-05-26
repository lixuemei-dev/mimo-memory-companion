/**
 * Comparison Tool — Compare results across different configurations
 */

const CompositeScorer = require('./composite');

class Comparison {
  constructor() {
    this.scorer = new CompositeScorer();
    this.results = new Map();
  }

  addResult(name, metrics) {
    const scored = this.scorer.score(metrics);
    this.results.set(name, { metrics, scored });
    return scored;
  }

  compare(nameA, nameB) {
    const a = this.results.get(nameA);
    const b = this.results.get(nameB);
    if (!a || !b) throw new Error('Result not found');
    return this.scorer.compare(a.scored, b.scored);
  }

  ranking() {
    return [...this.results.entries()]
      .sort((a, b) => b[1].scored.score - a[1].scored.score)
      .map(([name, data], i) => ({
        rank: i + 1,
        name,
        score: data.scored.score,
        grade: data.scored.grade,
      }));
  }

  report() {
    const rank = this.ranking();
    let md = `# Comparison Report\n\n`;
    md += `| Rank | Name | Score | Grade |\n|------|------|-------|-------|\n`;
    rank.forEach(r => {
      md += `| ${r.rank} | ${r.name} | ${r.score} | ${r.grade} |\n`;
    });
    return md;
  }
}

module.exports = Comparison;
