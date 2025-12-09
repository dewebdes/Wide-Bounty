#!/usr/bin/env node
/**
 * detect-direct.js - React2Shell Detection Probe for CVE-2025-55182 / CVE-2025-66478
 * Direct request (no proxy) - matches exactly what detect.sh does
 * 
 * Usage: node detect-direct.js <target_url>
 * Example: node detect-direct.js https://example.com
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');

const BOUNDARY = "----WebKitFormBoundaryx8jO2oVc6SWP3Sad";
const BODY = `--${BOUNDARY}
Content-Disposition: form-data; name="1"

{}
--${BOUNDARY}
Content-Disposition: form-data; name="0"

["$1:a:a"]
--${BOUNDARY}--`;

function normalizeTarget(t) {
    if (!t) return null;
    let clean = t.trim();
    if (!clean) return null;
    if (/^https?:\/\//i.test(clean)) return clean;
    return `https://${clean}`;
}

async function probeTarget(target) {
    console.log("[*] React2Shell Detection Probe (CVE-2025-55182 / CVE-2025-66478)");
    console.log("[*] Target:", target);
    console.log("");

    return new Promise((resolve, reject) => {
        try {
            const url = new URL(target);
            const isHttps = url.protocol === 'https:';
            const client = isHttps ? https : http;

            const options = {
                hostname: url.hostname,
                port: url.port || (isHttps ? 443 : 80),
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'Host': url.hostname,
                    'Next-Action': 'x',
                    'Content-Type': `multipart/form-data; boundary=${BOUNDARY}`,
                    'Content-Length': Buffer.byteLength(BODY),
                    'Connection': 'close',
                    'User-Agent': 'curl/7.81.0'
                },
                rejectUnauthorized: false, // Allow self-signed certs
                timeout: 10000
            };

            const req = client.request(options, (res) => {
                let responseBody = '';
                const statusCode = res.statusCode;

                res.on('data', (chunk) => {
                    responseBody += chunk;
                });

                res.on('end', () => {
                    console.log("[*] HTTP Status:", statusCode);

                    // Check for vulnerability signature: HTTP 500 + E{"digest" in response
                    if (statusCode === 500 && responseBody.includes('E{"digest"')) {
                        console.log("\n[!] VULNERABLE - Server returned 500 with E{\"digest\" pattern");
                        console.log("\n[*] Response body:");
                        console.log(responseBody);
                        console.log("\n[!] This server is running a vulnerable version of React RSC / Next.js");
                        console.log("[!] Upgrade to Next.js 16.0.7+ or React 19.2.1+ immediately");
                        resolve(1);
                    } else if (statusCode === 500) {
                        console.log("\n[?] UNKNOWN - Server returned 500 but without expected pattern");
                        console.log("[*] Response body:");
                        console.log(responseBody);
                        resolve(2);
                    } else {
                        console.log("\n[+] NOT VULNERABLE - Server did not return expected error pattern");
                        console.log("[*] HTTP", statusCode, "response indicates patched or non-RSC server");
                        resolve(0);
                    }
                });
            });

            req.on('error', (err) => {
                console.error("[!] Error:", err.message);
                reject(err);
            });

            req.on('timeout', () => {
                req.destroy();
                console.error("[!] Request timeout");
                reject(new Error('Request timeout'));
            });

            // Send the request body
            req.write(BODY);
            req.end();

        } catch (err) {
            console.error("[!] Error:", err.message);
            reject(err);
        }
    });
}

async function main() {
    // Get target from command line argument
    const targetArg = process.argv[2];

    if (!targetArg) {
        console.log("Usage: node detect-direct.js <target_url>");
        console.log("Example: node detect-direct.js https://example.com");
        console.log("");
        console.log("Note: This makes DIRECT requests (no proxy)");
        process.exit(1);
    }

    const target = normalizeTarget(targetArg);
    if (!target) {
        console.error("[!] Invalid target URL");
        process.exit(1);
    }

    try {
        const exitCode = await probeTarget(target);
        process.exit(exitCode);
    } catch (err) {
        process.exit(3);
    }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log("\n\n[*] Scan interrupted by user");
    process.exit(0);
});

main();