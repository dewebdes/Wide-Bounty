const fs = require('fs');
const https = require('https');
const readline = require('readline');

const controllers = [
    'https://soft-art-xxxx.ctrl-009.workers.dev/',
    'https://plain-fire-a7b8.xxxx.workers.dev/',
    'https://lively-xxxx-9453.moski.workers.dev/',
    'https://rough-xxxx-fa1f.tasir.workers.dev/',
    'https://shy-queen-8ea8.xxx.workers.dev/',
    'https://summer-xxx-8cf7.salamonpeg.workers.dev/',
    'https://super-xxxx-80db.mostadam8.workers.dev/'
];

const SUB_FILE = '24m.txt';
const PROGRESS_FILE = 'progress.json';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('🔍 Enter domain name: ', domain => {
    domain = domain.trim();
    const subs = fs.readFileSync(SUB_FILE, 'utf8')
        .split('\n')
        .map(line => line.trim())
        .filter(Boolean);

    let progress = { index: 0 };
    if (fs.existsSync(PROGRESS_FILE)) {
        try {
            const saved = JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
            if (saved.index && saved.index < subs.length) {
                console.log(`📂 Found previous progress at index ${saved.index}`);
                rl.question('↪️ Type "r" to reset or "c" to continue: ', choice => {
                    rl.close();
                    if (choice.trim().toLowerCase() === 'r') {
                        progress.index = 0;
                        console.log('🔄 Progress reset to 0');
                    } else {
                        progress.index = saved.index;
                        console.log(`⏩ Continuing from index ${progress.index}`);
                    }
                    run(domain, subs, progress);
                });
                return;
            }
        } catch { }
    }

    rl.close();
    run(domain, subs, progress);
});

function run(domain, subs, progress) {
    const logFile = `${domain}.log`;
    let controllerIndex = 0;
    let batchCount = 0;
    const startTime = Date.now();

    console.log(`🟢 Scan started at: ${new Date(startTime).toLocaleString()}`);

    async function nextBatch() {
        if (progress.index >= subs.length) {
            const endTime = Date.now();
            const durationMs = endTime - startTime;

            const seconds = Math.floor((durationMs / 1000) % 60);
            const minutes = Math.floor((durationMs / (1000 * 60)) % 60);
            const hours = Math.floor(durationMs / (1000 * 60 * 60));

            console.log(`🎉 All ${subs.length} subs processed. Scan complete.`);
            console.log(`⏱ Total time: ${hours}h ${minutes}m ${seconds}s`);
            return;
        }

        const batch = subs.slice(progress.index, progress.index + 50);
        const postData = JSON.stringify({ domain, subs: batch });
        const controllerUrl = controllers[controllerIndex % controllers.length];
        const timestamp = new Date().toISOString();
        batchCount++;

        const totalSubs = subs.length;
        const currentEnd = Math.min(progress.index + batch.length, totalSubs);
        const percent = ((currentEnd / totalSubs) * 100).toFixed(2);

        console.log(`\n📦 Batch #${batchCount}`);
        console.log(`🔗 Controller: ${controllerUrl}`);
        console.log(`📤 Sending subs ${progress.index} → ${currentEnd - 1}`);
        console.log(`📊 Progress: ${currentEnd}/${totalSubs} (${percent}%)`);
        console.log(`🕒 Time: ${timestamp}`);

        controllerIndex++;

        try {
            const result = await sendRequest(controllerUrl, postData);
            const found = result.alive_subs || [];

            if (found.length > 0) {
                fs.appendFileSync(logFile, found.map(sub => `${sub}.${domain}\n`).join(''));
                console.log(`✅ ${found.length} alive subs found`);
            } else {
                console.log('⚪️ No alive subs in this batch');
            }

            progress.index += batch.length;
            fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress));
            setTimeout(nextBatch, 100);
        } catch (err) {
            console.error(`❌ Request failed: ${err.message}`);
            console.log(`⏳ Retrying batch #${batchCount} in 5 seconds...`);
            setTimeout(nextBatch, 5000);
        }
    }

    nextBatch();
}

function sendRequest(url, postData) {
    return new Promise((resolve, reject) => {
        const req = https.request(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    resolve(result);
                } catch (err) {
                    reject(new Error('Failed to parse response'));
                }
            });
        });

        req.on('error', err => reject(err));
        req.write(postData);
        req.end();
    });
}
