const fs = require('fs');

const additionsFile = process.argv[2];
if (!additionsFile) {
    console.error("Please provide the JSON file.");
    process.exit(1);
}

const additions = JSON.parse(fs.readFileSync(additionsFile, 'utf-8'));
let code = fs.readFileSync('client/src/data/services.js', 'utf-8');

for (const [key, data] of Object.entries(additions)) {
    const startRegex = new RegExp(`^\\s*"${key}":\\s*\\{`, 'm');
    const match = startRegex.exec(code);
    if (!match) {
        console.error("Key not found:", key);
        continue;
    }
    const startIndex = match.index;
    let braceCount = 0;
    let endIndex = -1;
    for (let i = startIndex + match[0].length - 1; i < code.length; i++) {
        if (code[i] === '{') braceCount++;
        else if (code[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
                endIndex = i;
                break;
            }
        }
    }
    
    if (endIndex !== -1) {
        // Extract the block to check for existing keys
        const block = code.slice(startIndex, endIndex);
        
        let injection = '';
        for (const [newKey, newVal] of Object.entries(data)) {
            // Only inject if the key does not exist yet (to avoid duplicates)
            const keyRegex = new RegExp(`\\s*${newKey}:\\s*\\[`);
            if (!keyRegex.test(block)) {
                injection += `\n      ${newKey}: ${JSON.stringify(newVal, null, 2).split('\n').join('\n      ')},`;
            } else {
                console.log(`Skipping ${newKey} for ${key} because it already exists.`);
            }
        }
        injection += '\n    ';
        
        // Insert before the last closing brace
        code = code.slice(0, endIndex) + injection + code.slice(endIndex);
        console.log(`Successfully injected new data for ${key}.`);
    } else {
        console.error(`Could not find end brace for ${key}.`);
    }
}

fs.writeFileSync('client/src/data/services.js', code);
console.log("Injection complete.");
