const prompt = require('prompt-sync')();
const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = path.resolve(__dirname, 'C:\\Program Files\\Google\\Chrome\\Application', 'chrome.exe');

async function extractGlyphs(url) {
    const browser = await playwright.chromium.launch({
        executablePath: CHROME_PATH,
        headless: true
    });

    const page = await browser.newPage();

    // 🧱 Block CSS for clarity
    await page.route('**/*', route => {
        if (['stylesheet', 'image', 'font'].includes(route.request().resourceType())) {
            route.abort();
        } else {
            route.continue();
        }
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const body = await page.content();
    const glyphs = new Set();

    // 🧭 Query Params
    const queryParams = new URL(url).searchParams;
    for (const [key] of queryParams) glyphs.add(key);

    // 🧪 JS Variables
    [...body.matchAll(/(let|const|var)\s([\w\,\s]+)\s*?(\n|\r|;|=)/g)]
        .forEach(match => match[2].split(',').forEach(v => glyphs.add(v.trim())));

    // 🧬 JSON/Object Keys
    [...body.matchAll(/["']([\w\-]+)["']\s*?:/g)].forEach(m => glyphs.add(m[1]));

    // 🧿 Template Literals
    [...body.matchAll(/\${\s*([\w\-]+)\s*}/g)].forEach(m => glyphs.add(m[1]));

    // 🗝️ Function Inputs
    [...body.matchAll(/\(\s*["']?([\w\-]+)["']?(?:\s*,\s*["']?([\w\-]+)["']?)*\)/g)]
        .forEach(m => { for (let i = 1; i < m.length; i++) if (m[i]) glyphs.add(m[i]); });

    // 🚪 Path Variables
    [...body.matchAll(/\/\{(.*?)\}/g)].forEach(m => glyphs.add(m[1]));

    // 🧵 Inline Query Keys
    [...body.matchAll(/[\?&]([\w\-]+)=/g)].forEach(m => glyphs.add(m[1]));

    // 🧍 HTML Attributes
    [...body.matchAll(/name\s*=\s*["']([\w\-]+)["']/g)].forEach(m => glyphs.add(m[1]));
    [...body.matchAll(/id\s*=\s*["']([\w\-]+)["']/g)].forEach(m => glyphs.add(m[1]));

    await browser.close();
    return [...glyphs].filter(Boolean);
}

(async () => {
    const target = prompt('🎯 Enter target URL: ');
    const homepage = new URL(target).origin;


    console.log('\n🔍 Extracting homepage parameters...');
    const homeParams = await extractGlyphs(homepage);

    console.log('\n🔍 Extracting target URL parameters...');
    const targetParams = await extractGlyphs(target);

    // 🧮 Compute delta
    const homeSet = new Set(homeParams);
    const minParams = targetParams.filter(p => !homeSet.has(p));

    // 🧾 Save results
    fs.writeFileSync('parameters-max.txt', targetParams.join('\n'), 'utf-8');
    fs.writeFileSync('parameters-min.txt', minParams.join('\n'), 'utf-8');

    console.log('\n📁 Saved: parameters-max.txt (full) and parameters-min.txt (delta)');
})();
