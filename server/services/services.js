import { prisma } from "../config/db.js";

export async function fetchCategoriesAndServices() {
  return prisma.serviceCategory.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    include: {
      subcategories: {
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      },
      services: {
        where: { isActive: true },
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          slug: true,
          shortDesc: true,
          price: true,
          govtFees: true,
          timeToComplete: true,
          categoryId: true,
          subcategoryId: true,
        },
      },
    },
  });
}

export async function fetchServiceBySlug(slug) {
  return prisma.service.findUnique({
    where: { slug },
    include: {
      category: true,
      subcategory: true,
      features: { orderBy: { sortOrder: "asc" } },
      benefits: { orderBy: { sortOrder: "asc" } },
      processes: { orderBy: { sortOrder: "asc" } },
      documents: { orderBy: { sortOrder: "asc" } },
      faqs: { orderBy: { sortOrder: "asc" } },
      pricingPlans: { orderBy: { sortOrder: "asc" } },
    },
  });
}
