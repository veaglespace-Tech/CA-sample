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
      content = content.replace(/Your Company Name/g, 'Valuexpert');
      // Update the intro in ServicePageClient.js specifically
      if (file === 'ServicePageClient.js') {
          const oldIntro = 'intro: `Valuexpert helps you seamlessly navigate eligibility, documents, timelines, and filing steps for ${ title } across India.`,';
          const newIntro = 'intro: `Valuexpert is your trusted partner for seamlessly navigating the complexities of ${title}. Our dedicated team ensures that every aspect of your application—from eligibility checks to document preparation and final filing—is handled with precision. Whether you are a startup or a large enterprise, we provide tailored, end-to-end solutions that guarantee regulatory compliance. With fast-track processing and transparent pricing, you can focus on growing your business while we manage statutory requirements. Trust Valuexpert to deliver reliable and expert-led services across India.`,';
          content = content.replace(oldIntro, newIntro);
      }

      if (content !== original) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'client', 'src'));
replaceInDir(path.join(__dirname, 'server', 'src'));

console.log("Global restoration completed successfully.");
