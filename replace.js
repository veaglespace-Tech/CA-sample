const fs = require('fs');

const targetPath = "client/src/data/services.js";
const scratchPath = "C:/Users/ADMIN/.gemini/antigravity-ide/brain/442bc26c-d441-465a-b714-f1b00260b3cc/scratch/international.js";

let targetContent = fs.readFileSync(targetPath, 'utf8');
let scratchContent = fs.readFileSync(scratchPath, 'utf8');

const startIndex = scratchContent.indexOf("{") + 1;
const endIndex = scratchContent.lastIndexOf("}");
const newServices = scratchContent.substring(startIndex, endIndex).trim();

const pattern = /"overseas-direct-investment-odi-reporting": \{[\s\S]*?process: \["Board Approval for ODI"[\s\S]*?\},/;
if (pattern.test(targetContent)) {
  targetContent = targetContent.replace(pattern, newServices + ',');
  fs.writeFileSync(targetPath, targetContent, 'utf8');
  console.log("Replacement successful.");
} else {
  console.log("Pattern not found.");
}
