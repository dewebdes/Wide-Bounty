# RECON + AI

This repository aggregates AI-driven reconnaissance prompts, brute-force tooling, project discovery scripts, and specialized hunt engines.

---

## AI Wide Recon

Deep research for uncovering related domains using techniques like favicon fingerprinting, TLS certificate & WHOIS clustering, DNS history & subdomain enumeration, JS library/CDN pattern matching, and acquisition & affiliate research.

- Prompt: [wide-recon.md](https://github.com/dewebdes/Wide-Bounty/blob/main/ai/prompts/wide-recon.md)

---

## AI Mass Hunt

Identify the top weakest subdomains for bug bounty targeting, with a focus on XSS potential and prioritization strategies.

- Prompt: [mass-hunt.md](https://github.com/dewebdes/Wide-Bounty/blob/main/ai/prompts/mass-hunt.md)

---

## AI Narrow Recon

Analyze specific HTML responses to pinpoint potential pivot points for smart XSS payload chaining within a given page context.

- Prompt: [narrow-recon.md](https://github.com/dewebdes/Wide-Bounty/blob/main/ai/prompts/narrow-recon.md)

---

## Brute Force

Automated subdomain brute-forcing leveraging a controller/fan-out worker pattern for large-scale enumeration.

- Caller script: [caller.js](https://github.com/dewebdes/Wide-Bounty/blob/main/scripts/brute/caller.js) 

- Workers  
  - Controller: [controller.js](https://github.com/dewebdes/Wide-Bounty/blob/main/scripts/workers/controller.js)  
  - Sender: [sender.js](https://github.com/dewebdes/Wide-Bounty/blob/main/scripts/workers/sender.js)

---

## Project Discovery

A suite of scripts for domain and subdomain enumeration, plus automated screenshot capture and cleaning.

### Domains

- [domains.js](https://github.com/dewebdes/Wide-Bounty/blob/main/scripts/discovery/domains.js)

### Subdomains

- [subs.js](https://github.com/dewebdes/Wide-Bounty/blob/main/scripts/discovery/subs.js)

### Screen Shots

- Capture script: [shot.js](https://github.com/dewebdes/Wide-Bounty/blob/main/scripts/capture/shot.js)  
- Cleanup utility: [clean_shot.py](https://github.com/dewebdes/Wide-Bounty/blob/main/utils/sub/clean_shot.py)  
  - Chunk subdomains: [chunk_subdomains.js](https://github.com/dewebdes/Wide-Bounty/blob/main/utils/sub/chunk_subdomains.js)  
  - Random subdomains: [random_subdomains.js](https://github.com/dewebdes/Wide-Bounty/blob/main/utils/sub/random_subdomains.js)

### No JS

- Async HTTP: aiohttp  
- Synchronous HTTP: httpx / old school

---

## Chriki Hunt

Specialized engines for packet minification and AI-driven pentesting.

- [PacketMinify](https://github.com/dewebdes/PacketMinify)  
- [AI-Pentest-Engine](https://github.com/dewebdes/AI-Pentest-Engine)

<img src="https://github.com/dewebdes/Wide-Bounty/blob/main/xmind/RECON%20%2B%20Ai.png">

