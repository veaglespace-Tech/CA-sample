import { createRequire } from "module";
const require = createRequire(import.meta.url);
const archiver = require("archiver");
console.log(typeof archiver);
const archive = archiver('zip', { zlib: { level: 9 } });
console.log(typeof archive);
