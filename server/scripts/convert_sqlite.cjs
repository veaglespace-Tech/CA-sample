const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

// Change provider
schema = schema.replace(/provider\s*=\s*"mysql"/g, 'provider = "sqlite"');

// Remove @db.Text and Json modifiers (SQLite doesn't support them well)
schema = schema.replace(/@db\.Text/g, '');
schema = schema.replace(/Json\?/g, 'String?');
schema = schema.replace(/Json/g, 'String');

// Find all enum names
const enumMatches = [...schema.matchAll(/enum\s+([A-Za-z0-9_]+)\s*\{/g)];
const enumNames = enumMatches.map(m => m[1]);

// Replace all enum usages in models with String
// Replace all enum usages in models with String
enumNames.forEach(enumName => {
    // Replace "Type EnumName" with "Type String"
    const regex = new RegExp(`\\b${enumName}\\b`, 'g');
    schema = schema.replace(regex, 'String');
});

// Fix missing quotes around defaults
schema = schema.replace(/@default\(([A-Z_]+)\)/g, '@default("$1")');

// Remove all enum definitions
schema = schema.replace(/enum\s+String\s*\{[\s\S]*?\}/g, '');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log("Schema converted to SQLite successfully.");
