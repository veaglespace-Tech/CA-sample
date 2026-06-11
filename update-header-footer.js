const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'client', 'src', 'components', 'layout');

function updateFile(filename) {
  const filePath = path.join(componentsDir, filename);
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace blue utility classes with indigo
  content = content.replace(/bg-blue-50/g, "bg-indigo-50");
  content = content.replace(/bg-blue-100/g, "bg-indigo-100");
  content = content.replace(/bg-blue-400/g, "bg-indigo-400");
  content = content.replace(/bg-blue-500/g, "bg-indigo-500");
  content = content.replace(/bg-blue-600/g, "bg-indigo-600");
  content = content.replace(/bg-blue-700/g, "bg-indigo-700");
  content = content.replace(/bg-blue-900/g, "bg-indigo-900");

  content = content.replace(/text-blue-100/g, "text-indigo-100");
  content = content.replace(/text-blue-300/g, "text-indigo-300");
  content = content.replace(/text-blue-400/g, "text-indigo-400");
  content = content.replace(/text-blue-500/g, "text-indigo-500");
  content = content.replace(/text-blue-600/g, "text-indigo-600");
  content = content.replace(/text-blue-700/g, "text-indigo-700");

  content = content.replace(/shadow-blue-400/g, "shadow-indigo-400");
  content = content.replace(/shadow-blue-500/g, "shadow-indigo-500");
  content = content.replace(/shadow-blue-600/g, "shadow-indigo-600");

  content = content.replace(/ring-blue-100/g, "ring-indigo-100");
  content = content.replace(/ring-blue-500/g, "ring-indigo-500");

  content = content.replace(/border-blue-200/g, "border-indigo-200");
  content = content.replace(/border-blue-300/g, "border-indigo-300");
  content = content.replace(/border-blue-400/g, "border-indigo-400");
  content = content.replace(/border-blue-600/g, "border-indigo-600");

  content = content.replace(/from-blue-600/g, "from-indigo-600");
  content = content.replace(/from-blue-900/g, "from-indigo-900");
  content = content.replace(/to-blue-700/g, "to-indigo-700");

  // Custom inline styles replacements
  content = content.replace(/#3b82f6/g, "#4F46E5");
  content = content.replace(/--vs-blue/g, "--blue");
  content = content.replace(/#012b5d/g, "#1e1b4b"); // darker indigo
  content = content.replace(/#004a8f/g, "#312e81"); // darker indigo

  fs.writeFileSync(filePath, content);
}

updateFile('Header.js');
updateFile('Footer.js');
console.log('Header and Footer updated.');
