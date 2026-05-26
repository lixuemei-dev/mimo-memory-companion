# MiMo Memory Companion

[![CI](https://github.com/lixuemei-dev/mimo-memory-companion/actions/workflows/ci.yml/badge.svg)](https://github.com/lixuemei-dev/mimo-memory-companion/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/lixuemei-dev/mimo-memory-companion/releases)
[![Tests](https://img.shields.io/badge/tests-20+-green.svg)](https://github.com/lixuemei-dev/mimo-memory-companion)
[![Files](https://img.shields.io/badge/files-45+-orange.svg)](https://github.com/lixuemei-dev/mimo-memory-companion)
[![Lines](https://img.shields.io/badge/lines-4500+-purple.svg)](https://github.com/lixuemei-dev/mimo-memory-companion)

> Persistent memory layer for Xiaomi MiMo — making every conversation smarter than the last.

## Why This Exists

| Problem | Impact | Our Solution |
|---------|--------|--------------|
| Stateless Conversations | Each chat starts from zero | Persistent memory store across sessions |
| Context Loss | Important details forgotten mid-session | Automatic context injection with retrieval |
| No Learning | AI never improves from past interactions | Quality-aware memory compression |
| Repetitive Explanations | Users waste time re-explaining | Preference & fact memory recall |
| Fragmented Knowledge | Insights scattered across sessions | Unified memory architecture with decay |

## Quick Start

```bash
git clone https://github.com/lixuemei-dev/mimo-memory-companion.git
cd mimo-memory-companion
npm install
npm start
```

## How It Works

```
┌─────────────┐     ┌──────────────┐     ┌──────────────┐     ┌────────────┐
│   User      │────▶│   Store      │────▶│  Retrieve    │────▶│   Inject   │
│   Input     │     │   Memory     │     │  Relevant    │     │   Context  │
└─────────────┘     └──────────────┘     │  Memories    │     └─────┬──────┘
                                          └──────────────┘           │
                                                                     ▼
┌─────────────┐     ┌──────────────┐                         ┌────────────┐
│   Output    │◀────│   Respond    │◀────────────────────────│   LLM      │
│   to User   │     │   with Memory│                         │   (MiMo)   │
└─────────────┘     └──────────────┘                         └────────────┘
```

## Memory Types

| Type | Description | Use Case |
|------|-------------|----------|
| **Facts** | Concrete information (names, dates, numbers) | "My birthday is March 15" |
| **Preferences** | User choices and opinions | "I prefer dark mode" |
| **Summaries** | Compressed session overviews | "Yesterday we discussed API design" |
| **Emotional** | Sentiment and relationship context | "User was frustrated with deployment" |

## Adapters

| Adapter | Status | Notes |
|---------|--------|-------|
| **MiMo** | ✅ Primary | Optimized for MiMo-V2.5 token limits |
| **OpenAI** | ✅ Supported | GPT-4o / GPT-4 compatible |
| **Anthropic** | ✅ Supported | Claude 3.5 / Claude 4 compatible |

## Analyzers

| Analyzer | Purpose | Metrics |
|----------|---------|---------|
| **Memory Quality** | Evaluates stored memory relevance | Relevance score, compression ratio |
| **Recall Accuracy** | Measures retrieval precision | Precision, recall, F1 |
| **Session Cohesion** | Tracks conversation flow | Continuity score, drift detection |

## Workloads

### Stress Tests
- `massive-memory.json` — 10K+ memory entries
- `rapid-recall.json` — 100ms retrieval target
- `concurrent-sessions.json` — Parallel session handling

### Realistic Scenarios
- `daily-coding-session.json` — Typical dev workflow
- `research-reading.json` — Long-form content processing
- `long-conversation.json` — Extended multi-hour sessions

### Reference Baselines
- `gpt4o-baseline.json` — GPT-4o performance reference
- `claude35-baseline.json` — Claude 3.5 performance reference

## Token Consumption

| Metric | Estimate |
|--------|----------|
| Per Session | 80K–150K tokens |
| Monthly (Active User) | 800M–1.2B tokens |
| Storage per 1K Memories | ~2.5MB (JSON + embeddings) |

## Development

```bash
# Clone & install
git clone https://github.com/lixuemei-dev/mimo-memory-companion.git
cd mimo-memory-companion
npm install

# Run tests
npm test

# Build
npm run build

# Lint
npm run lint
```

## License

[MIT](LICENSE) © 2026 lixuemei-dev
