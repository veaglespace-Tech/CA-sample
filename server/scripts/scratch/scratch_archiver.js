import * as archiverModule from "archiver";
console.log(Object.keys(archiverModule));
const archiver = archiverModule.default || archiverModule.create || archiverModule;
console.log(typeof archiver);
