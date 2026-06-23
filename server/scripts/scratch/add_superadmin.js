import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'veaglespaceritesh@gmail.com';
  const password = 'Veagle@123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
    },
    create: {
      name: 'Ritesh Veaglespace',
      email: email,
      passwordHash: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`User ${user.email} saved as ${user.role} successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
