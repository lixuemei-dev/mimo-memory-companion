/**
 * Validate Script — Check project structure and file integrity
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

const REQUIRED_FILES = [
  'README.md', 'package.json', 'LICENSE', 'CONTRIBUTING.md', 'SECURITY.md',
  '.gitignore', '.env.example', 'docs/index.html',
  'src/index.js', 'src/cli.js',
  'src/core/memory-store.js', 'src/core/retriever.js', 'src/core/compressor.js', 'src/core/injector.js',
  'src/adapters/mimo.js', 'src/adapters/openai.js', 'src/adapters/anthropic.js',
  'src/analyzers/memory-quality.js', 'src/analyzers/recall-accuracy.js', 'src/analyzers/session-cohesion.js',
  'src/reporters/console.js', 'src/reporters/json.js', 'src/reporters/markdown.js',
  'src/utils/embeddings.js', 'src/utils/decay.js', 'src/utils/tokenizer.js',
  'scoring/weights.json', 'scoring/composite.js', 'scoring/comparison.js',
  'scripts/run.js', 'scripts/validate.js', 'scripts/compare.js',
  '.github/workflows/ci.yml',
];

function validate() {
  let passed = 0;
  let failed = 0;

  console.log('🔍 Validating project structure...\n');

  for (const file of REQUIRED_FILES) {
    const fullPath = path.join(ROOT, file);
    if (fs.existsSync(fullPath)) {
      const size = fs.statSync(fullPath).size;
      console.log(`  ✅ ${file} (${size} bytes)`);
      passed++;
    } else {
      console.log(`  ❌ ${file} — MISSING`);
      failed++;
    }
  }

  // Check directories
  const dirs = ['memories/examples', 'memories/templates', 'workloads/stress', 'workloads/realistic', 'workloads/reference', 'tests/unit', 'tests/integration', 'tests/fixtures', 'results'];
  for (const dir of dirs) {
    const fullPath = path.join(ROOT, dir);
    if (fs.existsSync(fullPath)) {
      console.log(`  ✅ ${dir}/`);
      passed++;
    } else {
      console.log(`  ❌ ${dir}/ — MISSING`);
      failed++;
    }
  }

  console.log(`\n📊 Results: ${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

validate();
