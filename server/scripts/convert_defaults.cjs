const fs = require('fs');
let schema = fs.readFileSync('prisma/schema.prisma', 'utf8');

schema = schema.replace(/@default\((USER)\)/g, '@default("$1")');
schema = schema.replace(/@default\((WEBSITE)\)/g, '@default("$1")');
schema = schema.replace(/@default\((CONTACT)\)/g, '@default("$1")');
schema = schema.replace(/@default\((NEW)\)/g, '@default("$1")');
schema = schema.replace(/@default\((OTHER)\)/g, '@default("$1")');
schema = schema.replace(/@default\((REGISTRATION)\)/g, '@default("$1")');
schema = schema.replace(/@default\((PENDING)\)/g, '@default("$1")');
schema = schema.replace(/@default\((LOGIN)\)/g, '@default("$1")');
schema = schema.replace(/@default\((PUBLISHED)\)/g, '@default("$1")');
schema = schema.replace(/@default\((DRAFT)\)/g, '@default("$1")');

fs.writeFileSync('prisma/schema.prisma', schema);
console.log("Fixed defaults");
