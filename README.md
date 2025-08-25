## 🧿 Mythic DNS Engine

A distributed, fault-tolerant diagnostic system for subdomain discovery, brute-force probing, and visual capture—designed with modular Cloudflare Workers, resilient workflows, and symbolic clarity.

---

### 🌌 Overview

This project orchestrates a multi-phase diagnostic ritual:

1. **Domain Discovery** — Extract root domains from ProjectDiscovery’s Chaos dataset.
2. **Subdomain Enumeration** — Use Subfinder to uncover subdomains.
3. **Brute-Force Probing** — Dispatch batched wordlist probes via distributed workers.
4. **Visual Capture** — Screenshot alive subdomains for glyphic analysis.

Each phase is modular, resumable, and narratable—designed for operational resilience and mythic clarity.

---

### 🗂️ Folder Structure

```
mythic-dns-engine/
├── config/           # Wordlists and config files
├── data/             # Discovered domains and subdomains
├── scripts/          # Modular diagnostic scripts
│   ├── discovery/    # Domain and subdomain discovery
│   ├── brute/        # Brute-force logic
│   ├── workers/      # Cloudflare Worker orchestration
│   └── capture/      # Screenshot logic
├── shots/            # Saved screenshots
├── logs/             # Optional runtime logs
├── utils/            # Shared helpers
├── package.json
└── README.md
```

---

### ⚙️ Setup

```bash
git clone https://github.com/yourname/mythic-dns-engine.git
cd mythic-dns-engine
npm install
```

Ensure you have:

- Node.js ≥ 18
- Subfinder installed and in your PATH
- Cloudflare Worker credentials (if needed)

---

### 🧭 Usage

#### 1. Extract Domains

```bash
node scripts/discovery/domains.js
```

Parses `chaos.json` and outputs `data/domains.txt`.

#### 2. Discover Subdomains

```bash
node scripts/discovery/subs.js
```

Uses Subfinder to populate `data/subs.txt`.

#### 3. Brute-Force Subdomains

```bash
node scripts/brute/caller.js
```

Dispatches batched probes using `config/wordlist.txt`.

#### 4. Capture Screenshots

```bash
node scripts/capture/shot.js
```

Saves screenshots to `shots/`.

---

### 🧱 Modular Components

- **controller.js** — Orchestrates worker logic
- **sender.js** — Dispatches batched probes
- **caller.js** — Main brute-force entry point
- **shot.js** — Screenshots alive subdomains
- **helpers.js** — File I/O, batching, logging

---

### 🧠 Philosophy

This engine treats diagnostics as ritual: each probe a symbolic echo, each screenshot a glyph. It is built to resume, retry, and reflect—honoring both technical resilience and mythic storytelling.

---

### 📜 License

MIT — use freely, narrate boldly.
