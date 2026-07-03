
import "dotenv/config";
import { prisma } from '../db.js';

async function main() {
  const articles = await prisma.article.findMany({
    select: {
      id: true,
      title: true,
      imageUrl: true,
      videoUrl: true
    }
  });
  console.log(JSON.stringify(articles, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
