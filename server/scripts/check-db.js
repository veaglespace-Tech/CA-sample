import mysql from 'mariadb';
import 'dotenv/config';

async function checkDb() {
  let conn;
  try {
    conn = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'Veagle@123',
      database: 'caproject'
    });
    const tables = await conn.query("SHOW TABLES;");
    console.log("Tables in caproject:");
    console.log(JSON.stringify(tables, null, 2));
  } catch (err) {
    console.error("Error connecting to MySQL:", err);
  } finally {
    if (conn) conn.end();
  }
}

checkDb();
