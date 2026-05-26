#!/usr/bin/env node

/**
 * MiMo Memory Companion — CLI Interface
 * Command-line tool for memory operations
 */

const MemoryStore = require('./core/memory-store');
const Retriever = require('./core/retriever');

const COMMANDS = ['init', 'store', 'recall', 'list', 'stats', 'gc'];

function parseArgs(argv) {
  const args = { command: null, options: {} };
  args.command = argv[2] || 'help';
  for (let i = 3; i < argv.length; i += 2) {
    if (argv[i].startsWith('--')) {
      args.options[argv[i].slice(2)] = argv[i + 1];
    }
  }
  return args;
}

async function main() {
  const { command, options } = parseArgs(process.argv);

  if (!COMMANDS.includes(command) || command === 'help') {
    console.log('🧠 MiMo Memory Companion CLI');
    console.log('Usage: mimo-memory <command> [options]');
    console.log('Commands:', COMMANDS.join(', '));
    return;
  }

  const store = new MemoryStore(options);
  await store.init();

  switch (command) {
    case 'init':
      console.log('✓ Memory store initialized');
      break;
    case 'store':
      const result = await store.add({ type: options.type, key: options.key, value: options.value });
      console.log('✓ Stored:', JSON.stringify(result));
      break;
    case 'recall':
      const retriever = new Retriever(store);
      const found = await retriever.findRelevant(options.query);
      console.log('✓ Found', found.length, 'memories');
      found.forEach(m => console.log(`  - ${m.key}: ${m.value}`));
      break;
    case 'list':
      const all = await store.list();
      console.log('✓ Total memories:', all.length);
      break;
    case 'stats':
      const stats = await store.getStats();
      console.log('✓ Stats:', JSON.stringify(stats, null, 2));
      break;
    case 'gc':
      const cleaned = await store.garbageCollect();
      console.log('✓ Cleaned', cleaned, 'stale memories');
      break;
  }
}

main().catch(console.error);
