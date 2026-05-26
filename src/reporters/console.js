/**
 * Console Reporter — Outputs results to terminal with formatting
 */

class ConsoleReporter {
  constructor(options = {}) {
    this.verbose = options.verbose || false;
    this.colors = { reset: '\x1b[0m', green: '\x1b[32m', yellow: '\x1b[33m', cyan: '\x1b[36m', red: '\x1b[31m' };
  }

  report(data) {
    console.log('\n' + this.colors.cyan + '═══════════════════════════════════════' + this.colors.reset);
    console.log(this.colors.green + '  📊 Memory Report' + this.colors.reset);
    console.log(this.colors.cyan + '═══════════════════════════════════════' + this.colors.reset);

    if (data.stats) {
      console.log(`  Total memories: ${data.stats.total}`);
      if (data.stats.byType) {
        Object.entries(data.stats.byType).forEach(([type, count]) => {
          console.log(`    ${type}: ${count}`);
        });
      }
    }

    if (data.quality) {
      const avg = data.quality.reduce((s, q) => s + q.score, 0) / (data.quality.length || 1);
      console.log(`  Quality score: ${(avg * 100).toFixed(1)}%`);
    }

    if (data.recall) {
      console.log(`  Recall F1: ${(data.recall.avgF1 * 100).toFixed(1)}%`);
    }

    console.log(this.colors.cyan + '═══════════════════════════════════════\n' + this.colors.reset);
  }
}

module.exports = ConsoleReporter;
