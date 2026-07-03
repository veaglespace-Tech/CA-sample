import { prisma } from "../config/db.js";
import { optionalString } from "../utils/core.js";

export async function executeSearch(data, meta) {
  const query = optionalString(data.query);
  if (!query) throw new Error("Search query is required");

  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { slug: { contains: query.toLowerCase().replace(/\s+/g, "-") } },
        { shortDesc: { contains: query, mode: "insensitive" } },
      ],
    },
    take: 8,
    select: { name: true, slug: true, shortDesc: true },
  });

  const matchedSlug = services[0]?.slug || null;
  await prisma.searchQuery.create({
    data: {
      query,
      matchedSlug,
      sourcePageSlug: optionalString(data.sourcePageSlug),
      pagePath: optionalString(data.pagePath),
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    },
  });

  return { matchedSlug, services };
}
