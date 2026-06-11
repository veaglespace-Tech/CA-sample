import { createPool } from 'mariadb';
import 'dotenv/config';

async function test() {
  const dbUrl = new URL(process.env.DATABASE_URL);
  console.log("Connecting with", {
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port, 10) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1)
  });
  const pool = createPool({
    host: dbUrl.hostname,
    port: parseInt(dbUrl.port, 10) || 3306,
    user: dbUrl.username,
    password: dbUrl.password,
    database: dbUrl.pathname.slice(1),
    timezone: dbUrl.searchParams.get('timezone') || 'local',
    connectionLimit: 10
  });

  const conn = await pool.getConnection();
  console.log("Connected successfully!");
  conn.release();
}
test().catch(console.error).finally(() => process.exit(0));
