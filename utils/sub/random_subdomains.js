const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const readline = require('readline');

// Paths
const folderPath = './shot2/busy';
const outputFile = 'random_subdomains.txt';

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Prompt user for sample size
rl.question('Enter number of subdomains to select [20]: ', answer => {
    // Parse input or fall back to 20
    const sampleSize = parseInt(answer, 10) > 0 ? parseInt(answer, 10) : 20;

    // 1. Read and extract subdomains
    const files = fs.readdirSync(folderPath)
        .filter(file => file.toLowerCase().endsWith('.png'));
    const subdomains = files.map(f => path.basename(f, '.png'));

    // 2. Shuffle (Fisher–Yates with crypto.randomInt)
    for (let i = subdomains.length - 1; i > 0; i--) {
        const j = crypto.randomInt(0, i + 1);
        [subdomains[i], subdomains[j]] = [subdomains[j], subdomains[i]];
    }

    // 3. Slice out the requested number
    const selected = subdomains.slice(0, sampleSize);

    // 4. Write to file
    fs.writeFileSync(outputFile, selected.join('\n'), 'utf8');
    console.log(`✅ Selected ${selected.length} random subdomains and saved to ${outputFile}`);

    rl.close();
});
