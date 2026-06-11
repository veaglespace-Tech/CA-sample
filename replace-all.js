const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file === 'node_modules' || file === '.next' || file === '.git' || file === 'public') continue;
    
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (/\.(js|jsx|ts|tsx|json|md|env)$/.test(file)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      let original = content;
      content = content.replace(/Valuexpert/g, 'Your Company Name');
      content = content.replace(/valuexpert\.in/g, 'yourdomain.com');
      content = content.replace(/support@valuexpert\.in/g, 'support@yourdomain.com');
      content = content.replace(/\+91 88881 72349/g, '+91 00000 00000');
      content = content.replace(/88881 72349/g, '00000 00000');
      content = content.replace(/8888172349/g, '0000000000');
      content = content.replace(/\+918766430214/g, '+910000000000');
      content = content.replace(/8766430214/g, '0000000000');
      content = content.replace(/valuexpert-assets/g, 'yourcompany-assets');

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'client', 'src'));
replaceInDir(path.join(__dirname, 'server', 'src'));

const oldAssetPath = path.join(__dirname, 'client', 'public', 'valuexpert-assets');
const newAssetPath = path.join(__dirname, 'client', 'public', 'yourcompany-assets');
if (fs.existsSync(oldAssetPath)) {
  fs.renameSync(oldAssetPath, newAssetPath);
}

console.log("Global replacement completed successfully.");
