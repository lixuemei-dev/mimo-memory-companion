/**
 * Markdown Reporter — Generates human-readable markdown reports
 */

const fs = require('fs');

class MarkdownReporter {
  constructor(options = {}) {
    this.outputDir = options.outputDir || './results';
  }

  report(data) {
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `report-${timestamp}.md`;
    const filepath = `${this.outputDir}/${filename}`;

    let md = `# Memory Report — ${timestamp}\n\n`;
    md += `## Statistics\n\n`;
    md += `| Metric | Value |\n|--------|-------|\n`;
    md += `| Total Memories | ${data.stats?.total || 0} |\n`;

    if (data.stats?.byType) {
      Object.entries(data.stats.byType).forEach(([type, count]) => {
        md += `| ${type} | ${count} |\n`;
      });
    }

    if (data.recall) {
      md += `\n## Recall Accuracy\n\n`;
      md += `| Metric | Score |\n|--------|-------|\n`;
      md += `| Precision | ${(data.recall.avgPrecision * 100).toFixed(1)}% |\n`;
      md += `| Recall | ${(data.recall.avgRecall * 100).toFixed(1)}% |\n`;
      md += `| F1 Score | ${(data.recall.avgF1 * 100).toFixed(1)}% |\n`;
    }

    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    fs.writeFileSync(filepath, md);
    console.log(`📝 Markdown report: ${filepath}`);
    return filepath;
  }
}

module.exports = MarkdownReporter;
