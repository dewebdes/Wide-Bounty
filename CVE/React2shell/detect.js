#!/usr/bin/env node
/**
 * detect.js - Non-destructive detection probe for CVE-2025-55182 / CVE-2025-66478
 *
 * Reads targets from targets.txt, continues from last index if exists,
 * runs detection flow one by one with 3s interval,
 * saves only vulnerable targets in detected.txt in realtime,
 * shows progress logs.
 */

const fs = require("fs");
const path = require("path");

const targetsFile = path.join(process.cwd(), "targets.txt");
const lastIndexFile = path.join(process.cwd(), "lastindex.txt");
const outputFile = path.join(process.cwd(), "detected.txt");

const BOUNDARY = "----WebKitFormBoundaryx8jO2oVc6SWP3Sad";
const BODY = `--${BOUNDARY}
Content-Disposition: form-data; name="1"

{}
--${BOUNDARY}
Content-Disposition: form-data; name="0"

["$1:a:a"]
--${BOUNDARY}--`;

function normalizeTarget(t) {
    // حذف BOM و کاراکترهای غیرقابل چاپ
    let clean = t.replace(/^\uFEFF/, "").replace(/[^\x20-\x7E]/g, "");
    clean = clean.trim();
    if (!clean) return null;
    if (/^https?:\/\//i.test(clean)) return clean;
    return `https://${clean}`;
}

async function probeTarget(target) {
    console.log(`[*] Probing target: ${target}`);
    try {
        const response = await fetch(target, {
            method: "POST",
            headers: {
                "Next-Action": "x",
                "Content-Type": `multipart/form-data; boundary=${BOUNDARY}`,
            },
            body: BODY,
        });

        const bodyText = await response.text();
        const httpCode = response.status;

        console.log(`[*] HTTP Status: ${httpCode}`);

        if (httpCode === 500 && bodyText.includes('E{"digest"')) {
            console.log(`[!] VULNERABLE - ${target}`);
            // فقط تارگت‌های آسیب‌پذیر ذخیره می‌شوند
            fs.appendFileSync(outputFile, `${target}\n`);
            return "VULNERABLE";
        } else if (httpCode === 500) {
            console.log(`[?] UNKNOWN - ${target}`);
            return "UNKNOWN";
        } else {
            console.log(`[+] NOT VULNERABLE - ${target}`);
            return "NOT VULNERABLE";
        }
    } catch (err) {
        console.error(`[!] Error probing ${target}: ${err.message}`);
        return "ERROR";
    }
}

async function main() {
    if (!fs.existsSync(targetsFile)) {
        console.error("targets.txt not found in current directory");
        process.exit(1);
    }

    const targets = fs.readFileSync(targetsFile, "utf-8")
        .split(/\r?\n/)
        .map(normalizeTarget)
        .filter(Boolean);

    let startIndex = 0;
    if (fs.existsSync(lastIndexFile)) {
        const idx = parseInt(fs.readFileSync(lastIndexFile, "utf-8"), 10);
        if (!isNaN(idx)) startIndex = idx;
    }

    console.log(`[*] Starting from index ${startIndex} of ${targets.length} targets`);

    for (let i = startIndex; i < targets.length; i++) {
        const target = targets[i];
        console.log(`\n=== [${i + 1}/${targets.length}] Target: ${target} ===`);
        const result = await probeTarget(target);

        fs.writeFileSync(lastIndexFile, String(i + 1));

        const percent = (((i + 1) / targets.length) * 100).toFixed(2);
        console.log(`[*] Progress: ${i + 1}/${targets.length} (${percent}%) - Result: ${result}`);

        if (i < targets.length - 1) {
            console.log("[*] Waiting 3 seconds before next target...");
            await new Promise(res => setTimeout(res, 3000));
        }
    }

    console.log("\n[*] All targets processed.");
}

main();
