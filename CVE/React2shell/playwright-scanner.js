#!/usr/bin/env node
// react2shell-scanner.js

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

class React2ShellScanner {
    constructor() {
        this.targetUrl = '';
        this.outputFile = 'react2shell_findings.txt';
        this.findings = [];
        this.browser = null;
        this.page = null;
        this.scanning = false;

        // React2Shell specific patterns
        this.react2shellPatterns = {
            // Headers
            headers: [
                'Next-Action',
                'next-action',
                'x-action-redirect',
                'X-Action-Redirect'
            ],

            // Request patterns
            requestPatterns: [
                // Action ID patterns
                /\$ACTION_ID_([a-f0-9]+)/,
                /"actionId":"([^"]+)"/,
                /"__action_id":"([^"]+)"/,
                /action=([a-f0-9]{40})/,

                // JSON payload patterns
                /\{"then":"\$1:/,
                /"then":"\$1:/,
                /"status":"resolved_model"/,
                /"reason":-1/,
                /"_response":/,
                /"_formData":/,
                /"\$1:constructor:constructor"/,
                /"\$1:__proto__:constructor"/,

                // URL patterns in requests
                /0=%7B.*%22then%22.*%24B0.*%7D/,  // URL-encoded chunk0
                /1=%22%24%400%22/,                // URL-encoded chunk1

                // Multipart boundary patterns
                /boundary=----WebKitFormBoundary/,
                /Content-Disposition: form-data.*name="0"/,
                /Content-Disposition: form-data.*name="1"/
            ],

            // Response patterns
            responsePatterns: [
                // Error messages
                /deserialization failed/i,
                /action validation failed/i,
                /invalid action id/i,
                /server action error/i,
                /next\.js.*action/i,

                // Success indicators
                /x-action-redirect.*http:\/\/x\//,
                /NEXT_REDIRECT.*push.*http:\/\/x\//,
                /303.*action-redirect/i,

                // Debug/error info
                /"message":"[^"]*deserialization[^"]*"/i,
                /"error":"[^"]*action[^"]*"/i,

                // Base64 output in redirects
                /http:\/\/x\/([A-Za-z0-9+/=]+);/,

                // Next.js specific
                /next[-\/]action/i,
                /server.*component/i
            ],

            // Content-Type patterns
            contentTypes: [
                'application/x-www-form-urlencoded',
                'multipart/form-data',
                'text/x-component',
                'application/json'
            ]
        };
    }

    async getUserInput() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            console.log('╔══════════════════════════════════════════════════╗');
            console.log('║      REACT2SHELL SCANNER v1.0                   ║');
            console.log('║      CVE-2025-55182 / CVE-2025-66478            ║');
            console.log('╚══════════════════════════════════════════════════╝\n');

            rl.question('🎯 Enter target URL: ', (url) => {
                this.targetUrl = url;
                console.log(`\n📡 Target: ${url}`);

                const filename = `react2shell_${Date.now()}.txt`;
                rl.question(`💾 Output file [${filename}]: `, (inputFile) => {
                    this.outputFile = inputFile || filename;
                    rl.close();
                    resolve();
                });
            });
        });
    }

    async initializeBrowser() {
        console.log('\n🚀 Initializing Chrome browser...');

        try {
            this.browser = await chromium.launch({
                executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                headless: false,
                args: [
                    '--start-maximized',
                    '--disable-blink-features=AutomationControlled',
                    '--ignore-certificate-errors'
                ]
            });

            const context = await this.browser.newContext({
                viewport: { width: 1920, height: 1080 },
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            });

            this.page = await context.newPage();

            console.log('✅ Browser initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize browser:', error.message);
            return false;
        }
    }

    setupReact2ShellInterception() {
        console.log('🔍 Setting up React2Shell-specific interception...');

        // Intercept ALL requests
        this.page.on('request', (request) => {
            this.analyzeRequestForReact2Shell(request);
        });

        // Intercept ALL responses
        this.page.on('response', async (response) => {
            await this.analyzeResponseForReact2Shell(response);
        });

        console.log('✅ React2Shell interception ready');
    }

    analyzeRequestForReact2Shell(request) {
        const url = request.url();
        const method = request.method();
        const headers = request.headers();
        const postData = request.postData();

        // Skip noisy requests
        if (this.isNoisyRequest(url)) return;

        const findings = [];

        // Check for Next-Action header
        this.react2shellPatterns.headers.forEach(header => {
            if (headers[header.toLowerCase()] || headers[header]) {
                const headerValue = headers[header.toLowerCase()] || headers[header];
                findings.push(`📤 REQUEST: Found "${header}" header: ${headerValue}`);

                // Save action ID if found
                if (header.toLowerCase().includes('action')) {
                    this.saveReact2ShellFinding(
                        `ACTION_ID_FOUND: ${headerValue} in ${method} ${url}`,
                        'Request Header'
                    );
                }
            }
        });

        // Check for interesting Content-Type
        const contentType = headers['content-type'] || '';
        this.react2shellPatterns.contentTypes.forEach(ct => {
            if (contentType.includes(ct)) {
                findings.push(`📤 REQUEST: Suspicious Content-Type: ${contentType}`);
            }
        });

        // Analyze POST data for React2Shell patterns
        if (postData && method === 'POST') {
            this.react2shellPatterns.requestPatterns.forEach(pattern => {
                const matches = postData.match(pattern);
                if (matches) {
                    const matchText = matches[0].length > 100
                        ? matches[0].substring(0, 100) + '...'
                        : matches[0];
                    findings.push(`📤 REQUEST: Pattern "${pattern.toString().substring(0, 50)}..." found in POST data`);

                    this.saveReact2ShellFinding(
                        `PAYLOAD_PATTERN: ${pattern.toString().substring(0, 30)} in ${url}\nMatch: ${matchText}`,
                        'Request Body'
                    );
                }
            });

            // Check if it looks like exploit payload
            if (postData.includes('$1:') && postData.includes('_response')) {
                findings.push('📤 REQUEST: Potential React2Shell exploit payload detected!');
                this.saveReact2ShellFinding(
                    `POTENTIAL_EXPLOIT_PAYLOAD: ${url}\nPreview: ${postData.substring(0, 200)}`,
                    'Request Body'
                );
            }
        }

        // Analyze URL for action patterns
        this.react2shellPatterns.requestPatterns.forEach(pattern => {
            const matches = url.match(pattern);
            if (matches) {
                findings.push(`📤 REQUEST: Pattern in URL: ${pattern.toString().substring(0, 50)}...`);
            }
        });

        // Log findings to console
        if (findings.length > 0) {
            console.log(`\n🎯 REACT2SHELL REQUEST FINDINGS for ${method} ${url}:`);
            findings.forEach(f => console.log(`   ${f}`));
        }
    }

    async analyzeResponseForReact2Shell(response) {
        const url = response.url();
        const status = response.status();
        const headers = response.headers();

        // Skip noisy responses
        if (this.isNoisyRequest(url)) return;

        const findings = [];

        // Check response headers for React2Shell indicators
        this.react2shellPatterns.headers.forEach(header => {
            if (headers[header.toLowerCase()] || headers[header]) {
                const headerValue = headers[header.toLowerCase()] || headers[header];
                findings.push(`📥 RESPONSE: Found "${header}" header: ${headerValue}`);

                // Check for x-action-redirect with base64 output
                if (header.toLowerCase().includes('x-action-redirect')) {
                    const b64Match = headerValue.match(/http:\/\/x\/([A-Za-z0-9+/=]+)/);
                    if (b64Match) {
                        findings.push(`📥 RESPONSE: Possible command output in redirect: ${b64Match[1].substring(0, 50)}...`);
                        this.saveReact2ShellFinding(
                            `COMMAND_OUTPUT_REDIRECT: ${url}\nBase64: ${b64Match[1]}`,
                            'Response Header'
                        );
                    }
                }
            }
        });

        // Check for interesting status codes
        if (status === 303 || status === 307) {
            findings.push(`📥 RESPONSE: Redirect status ${status} - might indicate successful exploit`);
        }

        if (status === 500) {
            findings.push(`📥 RESPONSE: Server error ${status} - might be exploit attempt`);
        }

        // Try to get response body
        try {
            const responseText = await response.text();

            // Search for React2Shell patterns in response body
            this.react2shellPatterns.responsePatterns.forEach(pattern => {
                const matches = responseText.match(pattern);
                if (matches) {
                    const matchText = matches[0].length > 100
                        ? matches[0].substring(0, 100) + '...'
                        : matches[0];
                    findings.push(`📥 RESPONSE: Pattern "${pattern.toString().substring(0, 50)}..." found`);

                    this.saveReact2ShellFinding(
                        `RESPONSE_PATTERN: ${pattern.toString().substring(0, 30)} in ${url}\nMatch: ${matchText}`,
                        'Response Body'
                    );
                }
            });

            // Check for error messages related to actions
            if (responseText.includes('deserialization') ||
                responseText.includes('action') &&
                (responseText.includes('error') || responseText.includes('fail'))) {
                findings.push('📥 RESPONSE: Action-related error detected');

                // Try to extract error message
                const errorMatch = responseText.match(/"message":"([^"]*)"/) ||
                    responseText.match(/<pre[^>]*>([^<]*)<\/pre>/);
                if (errorMatch) {
                    findings.push(`📥 RESPONSE: Error: ${errorMatch[1].substring(0, 100)}`);
                }
            }

        } catch (error) {
            // Can't read response body (binary, etc.)
        }

        // Log findings to console
        if (findings.length > 0) {
            console.log(`\n🎯 REACT2SHELL RESPONSE FINDINGS for ${status} ${url}:`);
            findings.forEach(f => console.log(`   ${f}`));
        }
    }

    isNoisyRequest(url) {
        const noisyPatterns = [
            'google',
            'gstatic',
            'facebook',
            'twitter',
            'gravatar',
            'cloudflare',
            'statistiek.rijksoverheid.nl', // Your analytics
            'doubleclick',
            'googlesyndication',
            'google-analytics',
            'facebook.net',
            'fbcdn.net',
            'ajax.googleapis.com'
        ];

        return noisyPatterns.some(pattern => url.includes(pattern));
    }

    saveReact2ShellFinding(finding, type) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${type}] ${finding}\n${'-'.repeat(80)}\n`;

        this.findings.push(logEntry);

        // Save to file in real-time
        fs.appendFileSync(this.outputFile, logEntry, 'utf8');
        console.log(`💾 Saved React2Shell finding to: ${this.outputFile}`);

        // Also log to console
        console.log(`🔍 NEW FINDING [${type}]: ${finding.split('\n')[0]}`);
    }

    async startScanning() {
        console.log('\n🌐 Navigating to target URL...');

        try {
            await this.page.goto(this.targetUrl, {
                waitUntil: 'networkidle',
                timeout: 60000
            });

            console.log('✅ Successfully loaded target page');

            // Auto-click forms to trigger actions
            await this.autoExploreForms();

            // Manual interaction mode
            console.log('\n' + '='.repeat(70));
            console.log('🎮 MANUAL INTERACTION MODE');
            console.log('='.repeat(70));
            console.log('Now you can manually:');
            console.log('1. Fill out forms');
            console.log('2. Click buttons');
            console.log('3. Search for content');
            console.log('4. Test any interactive elements');
            console.log('\nThe scanner will search for React2Shell patterns in ALL traffic.');
            console.log('Findings are saved in real-time to:', this.outputFile);
            console.log('\nPress Ctrl+C in this console to stop scanning.\n');

            this.scanning = true;

            // Keep the process alive
            await new Promise(() => { });

        } catch (error) {
            console.error('❌ Navigation error:', error.message);
            await this.cleanup();
        }
    }

    async autoExploreForms() {
        console.log('\n🤖 Auto-exploring forms for React2Shell actions...');

        try {
            // Find all forms
            const forms = await this.page.$$('form');
            console.log(`Found ${forms.length} forms`);

            for (let i = 0; i < forms.length; i++) {
                console.log(`\nTesting form ${i + 1}/${forms.length}...`);

                try {
                    // Get form action
                    const action = await forms[i].getAttribute('action');
                    const method = await forms[i].getAttribute('method') || 'GET';
                    console.log(`  Action: ${action}, Method: ${method}`);

                    // Find input fields
                    const inputs = await forms[i].$$('input, textarea, select');
                    console.log(`  Inputs: ${inputs.length}`);

                    // Fill dummy data if it's a POST form (potential action)
                    if (method.toUpperCase() === 'POST') {
                        console.log('  ⚠️ POST form detected - potential React2Shell target');

                        // Try to fill form with dummy data
                        for (const input of inputs) {
                            const inputType = await input.getAttribute('type');
                            const inputName = await input.getAttribute('name');

                            if (inputName && inputType !== 'hidden' && inputType !== 'submit') {
                                try {
                                    await input.fill('test');
                                    console.log(`    Filled: ${inputName}`);
                                } catch (e) {
                                    // Can't fill this input
                                }
                            }
                        }

                        // Try to submit
                        try {
                            const submitBtn = await forms[i].$('input[type="submit"], button[type="submit"]');
                            if (submitBtn) {
                                console.log('  Submitting form...');
                                await submitBtn.click();
                                await this.page.waitForTimeout(3000); // Wait for response
                            }
                        } catch (e) {
                            // Can't submit
                        }
                    }

                } catch (error) {
                    console.log(`  Error testing form: ${error.message}`);
                }

                // Wait a bit between forms
                await this.page.waitForTimeout(1000);
            }

        } catch (error) {
            console.log('Auto-exploration error:', error.message);
        }
    }

    async cleanup() {
        console.log('\n🧹 Cleaning up...');
        if (this.browser) {
            await this.browser.close();
        }

        // Print summary
        this.printSummary();
    }

    printSummary() {
        console.log('\n' + '='.repeat(70));
        console.log('📋 REACT2SHELL SCAN SUMMARY');
        console.log('='.repeat(70));
        console.log(`Target: ${this.targetUrl}`);
        console.log(`Findings: ${this.findings.length}`);
        console.log(`Output file: ${path.resolve(this.outputFile)}`);

        if (this.findings.length > 0) {
            console.log('\n🔥 REACT2SHELL INDICATORS FOUND:');

            const categories = {
                'ACTION_ID_FOUND': 0,
                'PAYLOAD_PATTERN': 0,
                'RESPONSE_PATTERN': 0,
                'COMMAND_OUTPUT_REDIRECT': 0,
                'POTENTIAL_EXPLOIT_PAYLOAD': 0
            };

            this.findings.forEach(finding => {
                for (const [category] of Object.entries(categories)) {
                    if (finding.includes(category)) {
                        categories[category]++;
                    }
                }
            });

            for (const [category, count] of Object.entries(categories)) {
                if (count > 0) {
                    console.log(`  ${category}: ${count} times`);
                }
            }

            console.log('\n📄 Check the output file for detailed findings.');
        } else {
            console.log('\n✅ No React2Shell indicators found.');
            console.log('   This doesn\'t mean the site is safe - it just means');
            console.log('   no obvious patterns were detected in the traffic.');
        }

        console.log('\n✅ Scan completed!');
    }

    async run() {
        try {
            await this.getUserInput();

            const initialized = await this.initializeBrowser();
            if (!initialized) {
                console.log('❌ Cannot continue without browser');
                return;
            }

            this.setupReact2ShellInterception();
            await this.startScanning();

        } catch (error) {
            console.error('❌ Unexpected error:', error);
            await this.cleanup();
        }
    }
}

// Run the scanner
(async () => {
    const scanner = new React2ShellScanner();

    // Check if Playwright is installed
    try {
        require('playwright');
    } catch (error) {
        console.log('📦 Installing Playwright...');
        const { execSync } = require('child_process');
        try {
            execSync('npm install playwright', { stdio: 'inherit' });
            console.log('✅ Playwright installed successfully');
        } catch (e) {
            console.error('❌ Failed to install Playwright');
            process.exit(1);
        }
    }

    // Handle Ctrl+C
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Stopping scanner...');
        await scanner.cleanup();
        process.exit(0);
    });

    await scanner.run();
})();