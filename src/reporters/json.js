/**
 * JSON Reporter — Outputs results as structured JSON
 */

const fs = require('fs');

class JsonReporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || './results';
  }

  report(data) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `report-${timestamp}.json`;
    const filepath = `${this.outputDir}/${filename}`;

    const report = {
      generatedAt: new Date().toISOString(),
      stats: data.stats || {},
      quality: data.quality || [],
      recall: data.recall || {},
      summary: this.generateSummary(data),
    };

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    console.log(`📄 Report saved: ${filepath}`);
    return report;
  }

  generateSummary(data) {
    const total = data.stats?.total || 0;
    const qualityAvg = data.quality?.length
      ? data.quality.reduce((s, q) => s + q.score, 0) / data.quality.length
      : 0;
    return { totalMemories: total, avgQuality: Math.round(qualityAvg * 100) / 100 };
  }
}

module.exports = JsonReporter;
