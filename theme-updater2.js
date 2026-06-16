const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'client/src/app/[slug]/ServicePageClient.js'),
  path.join(__dirname, 'client/src/components/services/ConsultForm.js'),
  path.join(__dirname, 'client/src/components/services/PackageCards.js')
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Fix any text-slate-900 next to bg-[#d29052] that the previous regex missed
    content = content.replace(/text-slate-900 bg-\[\#d29052\]/g, "text-white bg-[#d29052]");
    
    fs.writeFileSync(file, content);
    console.log("Updated fixes in", file);
  }
});
