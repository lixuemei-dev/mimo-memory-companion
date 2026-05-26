/**
 * MemoryStore — Core persistent storage engine
 * Handles CRUD operations, indexing, and persistence
 */

const fs = require('fs');
const path = require('path');

class MemoryStore {
  constructor(options = {}) {
    this.dir = options.dir || './memories/data';
    this.maxSize = options.maxSize || 10000;
    this.memories = [];
    this.index = new Map();
  }

  async init() {
    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir, { recursive: true });
    }
    await this.loadAll();
    console.log(`📦 MemoryStore: ${this.memories.length} memories loaded`);
  }

  async loadAll() {
    const files = fs.readdirSync(this.dir).filter(f => f.endsWith('.json'));
    this.memories = files.map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(this.dir, f), 'utf-8'));
      this.index.set(data.id, data);
      return data;
    });
  }

  async add(memory) {
    const entry = {
      id: memory.id || `mem_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      type: memory.type || 'fact',
      key: memory.key,
      value: memory.value,
      embedding: memory.embedding || null,
      createdAt: Date.now(),
      accessCount: 0,
      decayFactor: 1.0,
      ...memory
    };
    this.memories.push(entry);
    this.index.set(entry.id, entry);
    this.persist(entry);
    return entry;
  }

  async get(id) {
    const mem = this.index.get(id);
    if (mem) { mem.accessCount++; }
    return mem || null;
  }

  async remove(id) {
    this.memories = this.memories.filter(m => m.id !== id);
    this.index.delete(id);
  }

  async list(filter = {}) {
    return this.memories.filter(m => {
      if (filter.type && m.type !== filter.type) return false;
      return true;
    });
  }

  async getStats() {
    return {
      total: this.memories.length,
      byType: this.memories.reduce((acc, m) => { acc[m.type] = (acc[m.type]||0)+1; return acc; }, {}),
      avgAge: this.memories.reduce((s,m) => s + (Date.now()-m.createdAt), 0) / (this.memories.length || 1),
    };
  }

  async garbageCollect() {
    const before = this.memories.length;
    this.memories = this.memories.filter(m => m.decayFactor > 0.01);
    return before - this.memories.length;
  }

  persist(entry) {
    const filePath = path.join(this.dir, `${entry.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
  }

  async flush() {
    this.memories.forEach(m => this.persist(m));
  }
}

module.exports = MemoryStore;
