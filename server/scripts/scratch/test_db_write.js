import "dotenv/config";
import { prisma } from "../../src/config/db.js";

async function test() {
  try {
    const doc = await prisma.adminRepositoryDocument.create({
      data: {
        fileName: "timezone_test.pdf",
        fileUrl: "/uploads/test.pdf",
        description: "Testing IST timezone",
        category: "TEST"
      }
    });
    console.log("Success! Created doc with timestamp:", doc.createdAt);
    console.log("Local Time:", new Date(doc.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
  } catch (err) {
    console.error("Test failed:", err);
  } finally {
    process.exit(0);
  }
}

test();
