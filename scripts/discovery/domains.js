const fs = require('fs');
const https = require('https');

const CHAOS_URL = 'https://raw.githubusercontent.com/projectdiscovery/public-bugbounty-programs/main/chaos-bugbounty-list.json';
const OUTPUT_FILE = 'domains.txt';

function fetchChaosJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json.programs); // ✅ Access the correct array
                } catch (err) {
                    reject(`Failed to parse JSON: ${err}`);
                }
            });
        }).on('error', err => reject(`Request error: ${err}`));
    });
}

function extractDomains(programs) {
    const domainSet = new Set();
    for (const program of programs) {
        if (Array.isArray(program.domains)) {
            program.domains.forEach(domain => domainSet.add(domain.trim()));
        }
    }
    return Array.from(domainSet);
}

function saveToFile(domains, filename) {
    fs.writeFileSync(filename, domains.join('\n'), 'utf8');
    console.log(`✅ Saved ${domains.length} domains to ${filename}`);
}

(async () => {
    try {
        console.log('🔍 Fetching Chaos bug bounty domains...');
        const programs = await fetchChaosJSON(CHAOS_URL);
        const domains = extractDomains(programs);
        saveToFile(domains, OUTPUT_FILE);
    } catch (err) {
        console.error(`❌ Error: ${err}`);
    }
})();
