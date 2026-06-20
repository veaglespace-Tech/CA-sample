const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, '../client/src');

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content.replace(/\|\|\s*"(http:\/\/localhost:5000|http:\/\/localhost:5003)"/g, '|| ""');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log(`Updated: ${fullPath}`);
            }
        }
    });
}

walkDir(directoryPath);
