/**
 * MiMo Memory Companion — Entry Point
 * Persistent memory layer for Xiaomi MiMo
 */

const MemoryStore = require('./core/memory-store');
const Retriever = require('./core/retriever');
const Compressor = require('./core/compressor');
const Injector = require('./core/injector');
const MiMoAdapter = require('./adapters/mimo');

class MiMoMemoryCompanion {
  constructor(options = {}) {
    this.adapter = options.adapter || new MiMoAdapter();
    this.store = new MemoryStore(options.store || {});
    this.retriever = new Retriever(this.store, options.retrieval || {});
    this.compressor = new Compressor(options.compression || {});
    this.injector = new Injector(options.injection || {});
  }

  async init() {
    await this.store.init();
    this.adapter.connect();
    console.log('🧠 MiMo Memory Companion initialized');
    return this;
  }

  async processUserMessage(message, sessionId) {
    const memories = await this.retriever.findRelevant(message);
    const context = this.injector.buildContext(memories);
    return { context, memories };
  }

  async processAssistantResponse(response, sessionId) {
    const extracted = await this.compressor.extract(response);
    if (extracted.length > 0) {
      await this.store.add(extracted);
    }
    return extracted;
  }

  async shutdown() {
    await this.store.flush();
    this.adapter.disconnect();
  }
}

module.exports = MiMoMemoryCompanion;

if (require.main === module) {
  const companion = new MiMoMemoryCompanion();
  companion.init().then(() => console.log('Ready'));
}
