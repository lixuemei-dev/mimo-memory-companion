/**
 * Run Script — Execute workloads and collect results
 */

const fs = require('fs');
const path = require('path');
const MemoryStore = require('../src/core/memory-store');
const Retriever = require('../src/core/retriever');

const RESULTS_DIR = path.join(__dirname, '../results');

async function runWorkload(workloadPath) {
  console.log(`\n🚀 Running workload: ${path.basename(workloadPath)}`);
  const workload = JSON.parse(fs.readFileSync(workloadPath, 'utf-8'));
  console.log(`   ${workload.description}`);

  const store = new MemoryStore({ dir: path.join(__dirname, '../results/tmp') });
  await store.init();

  const results = { name: workload.name, operations: [], startTime: Date.now() };

  for (const op of workload.operations) {
    const start = Date.now();
    switch (op.type) {
      case 'bulk_insert':
        for (let i = 0; i < Math.min(op.count, 100); i++) {
          await store.add({ type: 'fact', key: `item_${i}`, value: `Value for item ${i}` });
        }
        break;
      case 'recall':
        const retriever = new Retriever(store, { threshold: 0.1 });
        await retriever.findRelevant('test query');
        break;
      case 'stats':
        await store.getStats();
        break;
    }
    results.operations.push({ type: op.type, durationMs: Date.now() - start });
  }

  results.totalTimeMs = Date.now() - results.startTime;
  console.log(`   ✅ Completed in ${results.totalTimeMs}ms`);
  return results;
}

async function main() {
  if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true });

  const workloadDir = path.join(__dirname, '../workloads/realistic');
  const files = fs.readdirSync(workloadDir).filter(f => f.endsWith('.json'));

  const allResults = [];
  for (const file of files) {
    const result = await runWorkload(path.join(workloadDir, file));
    allResults.push(result);
  }

  const reportPath = path.join(RESULTS_DIR, `run-${Date.now()}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(allResults, null, 2));
  console.log(`\n📄 Results saved to ${reportPath}`);
}

main().catch(console.error);
