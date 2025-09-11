const fs = require('fs');
const path = require('path');

const folderPath = './shot2/busy';
const chunkSizeLimit = 10240;
const separator = '\n---CHUNK BREAK---\n';

const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.png'));

const subdomains = files.map(file => path.basename(file, '.png')); // Extract full base name

const chunks = [];
let currentChunk = '';

for (const sub of subdomains) {
    const line = sub + '\n';
    if ((currentChunk.length + line.length) > chunkSizeLimit) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
    }
    currentChunk += line;
}
if (currentChunk) chunks.push(currentChunk.trim());

fs.writeFileSync('subdomains_chunked.txt', chunks.join(separator));
console.log(`✅ Extracted ${subdomains.length} subdomains into ${chunks.length} clean blocks.`);
