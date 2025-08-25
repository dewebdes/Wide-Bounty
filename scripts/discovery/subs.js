const fs = require('fs');
const { exec } = require('child_process');

const DOMAINS_FILE = 'domains.txt';
const SUBS_FILE = 'subs.txt';
const PROGRESS_FILE = 'subfinder-progress.json';
const INTERVAL_MS = 3000;
const RETRY_DELAY_MS = 5000;

function readDomains(file) {
    return fs.readFileSync(file, 'utf8').split('\n').map(d => d.trim()).filter(Boolean);
}

function readProgress() {
    try {
        const data = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
        return typeof data.index === 'number' ? data.index : 0;
    } catch {
        return 0;
    }
}

function saveProgress(index) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify({ index }, null, 2), 'utf8');
}

function runSubfinder(domain) {
    return new Promise((resolve, reject) => {
        exec(`subfinder -d ${domain} -silent`, (err, stdout, stderr) => {
            if (err || stderr.includes('network') || stderr.includes('timeout')) {
                return reject(`Network error for ${domain}`);
            }
            const subs = stdout.split('\n').map(s => s.trim()).filter(Boolean);
            resolve(subs);
        });
    });
}

function appendSubs(subs) {
    if (subs.length > 0) {
        fs.appendFileSync(SUBS_FILE, subs.join('\n') + '\n', 'utf8');
    }
}

function logProgress(index, total) {
    const percent = ((index / total) * 100).toFixed(2);
    console.log(`📊 Progress: ${index}/${total} (${percent}%)`);
}

(async () => {
    const domains = readDomains(DOMAINS_FILE);
    let index = readProgress();

    console.log(`🌀 Resuming subfinder ritual from index ${index} of ${domains.length}`);

    while (index < domains.length) {
        const domain = domains[index];
        logProgress(index, domains.length);
        console.log(`🔍 Probing: ${domain}`);

        try {
            const subs = await runSubfinder(domain);
            appendSubs(subs);
            console.log(`✅ ${subs.length} subdomains saved`);
            index++;
            saveProgress(index);
            await new Promise(res => setTimeout(res, INTERVAL_MS));
        } catch (err) {
            console.error(`⚠️ ${err} — retrying after ${RETRY_DELAY_MS / 1000}s`);
            await new Promise(res => setTimeout(res, RETRY_DELAY_MS));
        }
    }

    console.log('🏁 Subdomain discovery complete. Echoes logged.');
})();
