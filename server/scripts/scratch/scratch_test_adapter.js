import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { createPool } from 'mariadb';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import 'dotenv/config';

async function test() {
  const pool = createPool(process.env.DATABASE_URL);
  const adapter = new PrismaMariaDb(pool);
  const prisma = new PrismaClient({ adapter });
  
  const userCount = await prisma.user.count();
  console.log("User count:", userCount);
}
test().catch(console.error).finally(() => process.exit(0));
