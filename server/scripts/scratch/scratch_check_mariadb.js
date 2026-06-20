import { createPool } from 'mariadb';
const pool = createPool({ host: "localhost", user: "root", password: "root", database: "caproject" });
pool.getConnection().then(c => { console.log("Connected with object"); c.release(); }).catch(console.error);

const pool2 = createPool("mariadb://root:root@localhost:3306/caproject");
pool2.getConnection().then(c => { console.log("Connected with string"); c.release(); }).catch(console.error);

setTimeout(() => process.exit(0), 1000);
