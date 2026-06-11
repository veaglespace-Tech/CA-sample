const fs = require('fs');
const path = require('path');

const srcAppDir = path.join(__dirname, 'src', 'app');

function getDepth(filePath) {
  const relativePath = path.relative(srcAppDir, filePath);
  return relativePath.split(path.sep).length - 1; 
  // src/app/(main)/events/page.js -> (main) / events / page.js -> 3 segments -> depth 2
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Calculate depth from `src/app`
      const relativeToApp = path.relative(srcAppDir, fullPath);
      const parts = relativeToApp.split(path.sep);
      // e.g. ["(main)", "events", "page.js"]
      
      // If the first part is a route group like "(main)", the depth has increased by 1.
      if (parts.length > 0 && parts[0].startsWith('(') && parts[0].endsWith(')')) {
        // We replace any import starting with "../" by adding one more "../"
        const newContent = content.replace(/(import\s+.*?\s+from\s+['"]|import\(['"])(\.\.\/[^'"]+)(['"])/g, (match, p1, p2, p3) => {
          return p1 + '../' + p2 + p3;
        });
        
        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log('Fixed:', relativeToApp);
        }
      }
    }
  }
}

processDirectory(srcAppDir);
