import { prisma } from './config/db.js';

async function getLatestOtp() {
  const otpRecord = await prisma.loginOtp.findFirst({
    orderBy: { createdAt: 'desc' },
  });
  console.log("LATEST OTP IN DATABASE:", otpRecord);
  process.exit(0);
}

getLatestOtp();
