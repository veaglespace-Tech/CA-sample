const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, 'client/src/app/[slug]/ServicePageClient.js'),
  path.join(__dirname, 'client/src/components/services/ConsultForm.js'),
  path.join(__dirname, 'client/src/components/services/PackageCards.js')
];

function updateContent(content) {
  let c = content;
  
  // Backgrounds
  c = c.replace(/bg-\[\#131a1d\]/g, "bg-slate-50");
  c = c.replace(/bg-\[\#1a2327\]/g, "bg-white");
  
  // Borders
  c = c.replace(/border-white\/10/g, "border-slate-200");
  c = c.replace(/border-white\/5/g, "border-slate-100");
  c = c.replace(/border-white\/20/g, "border-slate-300");
  c = c.replace(/border-white\/30/g, "border-slate-300");
  
  // Text Colors with Opacity
  c = c.replace(/text-white\/90/g, "text-slate-800");
  c = c.replace(/text-white\/80/g, "text-slate-700");
  c = c.replace(/text-white\/70/g, "text-slate-600");
  c = c.replace(/text-white\/60/g, "text-slate-500");
  c = c.replace(/text-white\/50/g, "text-slate-500");
  c = c.replace(/text-white\/40/g, "text-slate-400");
  c = c.replace(/text-white\/30/g, "text-slate-300");
  c = c.replace(/text-white\/20/g, "text-slate-300");
  
  // Backgrounds with Opacity
  c = c.replace(/bg-white\/10/g, "bg-slate-100");
  c = c.replace(/bg-white\/5/g, "bg-slate-50");
  c = c.replace(/bg-white\/20/g, "bg-slate-200");
  
  // Main Text Color
  c = c.replace(/\btext-white\b/g, "text-slate-900");
  
  // Restore white text on primary buttons and badges where it looks better
  c = c.replace(/bg-\[\#d29052\] text-slate-900/g, "bg-[#d29052] text-white");
  c = c.replace(/text-slate-900 px-8 py-3.5/g, "text-white px-8 py-3.5"); // Hero View Packages Button
  c = c.replace(/text-slate-900 text-\[10px\]/g, "text-white text-[10px]"); // Active Offer badge
  c = c.replace(/text-slate-900 px-4 py-1.5/g, "text-white px-4 py-1.5");
  c = c.replace(/text-slate-900 shadow-md hover:shadow-lg/g, "text-white shadow-md hover:shadow-lg"); // Package Buy Now highlight
  
  // Phone Input inline styles in ConsultForm
  c = c.replace(/'#2a1a1f'/g, "'#fff1f2'"); // error bg
  c = c.replace(/'#1a2722'/g, "'#f0fdf4'"); // success bg
  c = c.replace(/'#131a1d'/g, "'#f8fafc'"); // normal bg
  c = c.replace(/'#ffffff'/g, "'#0f172a'"); // text color
  c = c.replace(/'rgba\(255,255,255,0\.1\)'/g, "'#e2e8f0'"); // border color

  // Remove the mix-blend-overlay to make hero clear and bright
  c = c.replace(/mix-blend-overlay/g, "mix-blend-multiply opacity-5");
  
  return c;
}

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = updateContent(content);
    fs.writeFileSync(file, content);
    console.log("Updated", file);
  } else {
    console.log("File not found:", file);
  }
});
