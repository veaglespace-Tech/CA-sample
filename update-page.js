const fs = require('fs');
const path = require('path');

const pagePath = path.join(__dirname, 'client', 'src', 'app', 'page.js');
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Update Hero Copy
content = content.replace(
  "India&apos;s Most Trusted",
  "Launch & Scale Your"
);
content = content.replace(
  "Platform for Legal, Tax & Compliance.",
  "Business With Total Confidence."
);
content = content.replace(
  "Incorporate your company, register for GST, and protect your IP online. Your Company Name connects you with verified CA &amp; legal professionals—faster, smarter, at transparent pricing.",
  "Your all-in-one SaaS platform for company incorporation, GST filing, trademark protection, and continuous compliance. Experience seamless business management with our premium expert network."
);

// 2. Update Blob Colors in Hero
content = content.replace(/bg-blue-500\/10/g, "bg-indigo-500/10");
content = content.replace(/bg-violet-500\/10/g, "bg-teal-500/10");
content = content.replace(/bg-cyan-400\/10/g, "bg-rose-400/10");
content = content.replace(/bg-blue-500\/5/g, "bg-indigo-500/5");
content = content.replace(/from-indigo-800 via-violet-800 to-blue-800/g, "from-indigo-900 via-indigo-600 to-teal-500");

// 3. Update Journey Cards Colors
// start tone
content = content.replace(/from-blue-500 to-cyan-400/g, "from-indigo-600 to-indigo-400");
content = content.replace(/bg-blue-500/g, "bg-indigo-500");
content = content.replace(/shadow-blue-500/g, "shadow-indigo-500");
content = content.replace(/rgba\(59,130,246/g, "rgba(79,70,229"); // indigo-600 rgb
content = content.replace(/border-blue-300/g, "border-indigo-300");
content = content.replace(/text-blue-600/g, "text-indigo-600");
content = content.replace(/hover:bg-blue-50/g, "hover:bg-indigo-50");
content = content.replace(/hover:border-blue-200/g, "hover:border-indigo-200");
content = content.replace(/hover:text-blue-700/g, "hover:text-indigo-700");

// manage tone
content = content.replace(/from-violet-500 to-purple-400/g, "from-teal-600 to-teal-400");
content = content.replace(/bg-violet-500/g, "bg-teal-500");
content = content.replace(/shadow-violet-500/g, "shadow-teal-500");
content = content.replace(/rgba\(139,92,246/g, "rgba(13,148,136"); // teal-600 rgb
content = content.replace(/border-violet-300/g, "border-teal-300");
content = content.replace(/text-violet-600/g, "text-teal-600");

// protect tone
content = content.replace(/from-emerald-500 to-teal-400/g, "from-slate-800 to-slate-600");
content = content.replace(/bg-emerald-500/g, "bg-slate-700");
content = content.replace(/shadow-emerald-500/g, "shadow-slate-500");
content = content.replace(/rgba\(16,185,129/g, "rgba(30,41,59"); // slate-800 rgb
content = content.replace(/border-emerald-300/g, "border-slate-300");
content = content.replace(/text-emerald-600/g, "text-slate-600");

// 4. Update the colorMap
content = content.replace(/text-blue-500/g, "text-indigo-500");
content = content.replace(/bg-blue-100/g, "bg-indigo-100");
content = content.replace(/bg-blue-50/g, "bg-indigo-50");
content = content.replace(/ring-blue-100/g, "ring-indigo-100");
content = content.replace(/border-blue-200/g, "border-indigo-200");

content = content.replace(/text-violet-500/g, "text-teal-500");
content = content.replace(/bg-violet-100/g, "bg-teal-100");
content = content.replace(/bg-violet-50/g, "bg-teal-50");
content = content.replace(/ring-violet-100/g, "ring-teal-100");
content = content.replace(/border-violet-200/g, "border-teal-200");

content = content.replace(/text-emerald-500/g, "text-slate-600");
content = content.replace(/bg-emerald-100/g, "bg-slate-100");
content = content.replace(/bg-emerald-50/g, "bg-slate-50");
content = content.replace(/ring-emerald-100/g, "ring-slate-100");
content = content.replace(/border-emerald-200/g, "border-slate-200");

// Also update the accent hex codes in growthTracks
content = content.replace(/accent: "#3b82f6"/g, 'accent: "#4f46e5"'); // indigo-600
content = content.replace(/accent: "#8b5cf6"/g, 'accent: "#0d9488"'); // teal-600
content = content.replace(/accent: "#10b981"/g, 'accent: "#1e293b"'); // slate-800

// Update reviews gradient to match new tones
content = content.replace(/from-blue-400 to-cyan-400/g, "from-indigo-500 to-indigo-400");
content = content.replace(/from-violet-400 to-fuchsia-400/g, "from-teal-500 to-teal-400");
content = content.replace(/from-emerald-400 to-teal-400/g, "from-slate-600 to-slate-500");

// 5. Update typography class globally on page (just to be sure if anything was explicitly set to old fonts, but we use tailwind vars mostly).
content = content.replace(/selection:bg-blue-500\/20/g, "selection:bg-indigo-500/20");
content = content.replace(/selection:text-blue-700/g, "selection:text-indigo-700");

fs.writeFileSync(pagePath, content);
console.log("page.js updated successfully.");
