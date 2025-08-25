const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SUBS_FILE = 'subs.txt';
const USED_INDEXES_FILE = 'used-indexes.json';
const SHOT_DIR = path.resolve(__dirname, 'shot');
const CHROME_PATH = path.resolve(__dirname, 'C:\\Program Files\\Google\\Chrome\\Application', 'chrome.exe');

const FAILURE_THRESHOLD = 10;
let consecutiveFailures = 0;

// Load subdomains from file
function readSubs() {
    return fs.readFileSync(SUBS_FILE, 'utf8')
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);
}

// Load used indexes from file
function readUsedIndexes() {
    if (fs.existsSync(USED_INDEXES_FILE)) {
        return new Set(JSON.parse(fs.readFileSync(USED_INDEXES_FILE, 'utf8')));
    }
    return new Set();
}

// Save used indexes to file
function saveUsedIndexes(indexes) {
    fs.writeFileSync(USED_INDEXES_FILE, JSON.stringify(Array.from(indexes), null, 2), 'utf8');
}

// Get a random unused index
function getRandomUnusedIndex(total, used) {
    const unused = [...Array(total).keys()].filter(i => !used.has(i));
    if (unused.length === 0) return null;
    const randomIndex = unused[Math.floor(Math.random() * unused.length)];
    return randomIndex;
}

// Check connectivity to Instagram using Playwright
async function checkInstagramConnectivity() {
    return true;
    try {
        const browser = await chromium.launch({
            executablePath: CHROME_PATH,
            headless: true
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('https://www.instagram.com', { timeout: 10000 });
        const status = await page.title();

        await browser.close();

        console.log(`🌐 Instagram loaded: "${status}"`);
        return true;
    } catch (err) {
        console.error(`🚫 Instagram unreachable: ${err.message}`);
        return false;
    }
}

// Capture screenshot of subdomain
async function captureScreenshot(subdomain) {
    const url = `https://${subdomain}`;
    const filename = path.join(SHOT_DIR, `${subdomain.replace(/[^a-zA-Z0-9.-]/g, '_')}.png`);

    const browser = await chromium.launch({
        executablePath: CHROME_PATH,
        headless: true
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    try {
        await page.goto(url, { timeout: 10000 });
        await page.screenshot({ path: filename });
        console.log(`📸 Screenshot saved: ${filename}`);
        return 'success';
    } catch (err) {
        console.error(`⚠️ Failed to load ${url}: ${err.message}`);
        return 'fail';
    } finally {
        await browser.close();
    }
}

// Main execution loop
(async () => {
    if (!fs.existsSync(SHOT_DIR)) fs.mkdirSync(SHOT_DIR);

    const subs = readSubs();
    const usedIndexes = readUsedIndexes();

    console.log(`📂 Loaded ${subs.length} subdomains`);
    console.log(`🔎 Used indexes: ${usedIndexes.size}`);

    while (true) {
        const index = getRandomUnusedIndex(subs.length, usedIndexes);
        if (index === null) {
            console.log('✅ All subdomains processed. Ritual complete.');
            break;
        }

        const subdomain = subs[index];
        console.log(`🎯 Selected index ${index}: ${subdomain}`);

        const result = await captureScreenshot(subdomain);

        if (result === 'success') {
            consecutiveFailures = 0;
            usedIndexes.add(index);
            saveUsedIndexes(usedIndexes);
            console.log(`🧭 Progress saved. ${usedIndexes.size}/${subs.length} complete.`);
        } else if (result === 'fail') {
            consecutiveFailures++;
            console.log(`🔁 Consecutive failures: ${consecutiveFailures}`);

            if (consecutiveFailures >= FAILURE_THRESHOLD) {
                console.log(`🔍 Threshold reached. Checking Instagram...`);
                const instaOk = await checkInstagramConnectivity();

                if (instaOk) {
                    console.log(`✅ Instagram resolved — skipping ${subdomain}`);
                    usedIndexes.add(index);
                    saveUsedIndexes(usedIndexes);
                    console.log(`🧭 Progress saved. ${usedIndexes.size}/${subs.length} complete.`);
                    consecutiveFailures = 0;
                } else {
                    console.error(`❌ Instagram unreachable — exiting ritual.`);
                    break;
                }
            }
        }

        await new Promise(resolve => setTimeout(resolve, 500)); // Optional delay
    }
})();
