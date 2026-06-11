import "dotenv/config";
import { prisma } from "../src/db.js";
import { slugify } from "../src/utils.js";

async function testCreate() {
  try {
    const title = "Test Article " + Date.now();
    const slug = slugify(title) + "-" + Math.random().toString(36).substring(7);
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content: "Test content",
        category: "GENERAL"
      }
    });
    console.log("Success:", article);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testCreate();
