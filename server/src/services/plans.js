const normalizeSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const buildInsensitiveContains = (value) => ({
  contains: value,
});

export function parsePlanListQuery(query = {}) {
  const page = Math.max(Number(query.page || 1), 1);
  const limit = Math.min(Math.max(Number(query.limit || 10), 1), 50);
  const search = String(query.search || "").trim();
  const categoryId = String(query.categoryId || "").trim();
  const subcategoryId = String(query.subcategoryId || "").trim();
  const serviceSlug = normalizeSlug(String(query.serviceSlug || "").trim());

  return { page, limit, search, categoryId, subcategoryId, serviceSlug };
}

export async function resolveAllowedServiceIds(prisma, { categoryId, subcategoryId, serviceSlug }) {
  const serviceWhere = {};

  if (serviceSlug) {
    serviceWhere.slug = serviceSlug;
  } else {
    if (subcategoryId) serviceWhere.subcategoryId = subcategoryId;
    if (categoryId) serviceWhere.categoryId = categoryId;
  }

  if (!serviceSlug && !categoryId && !subcategoryId) {
    return null;
  }

  const matchingServices = await prisma.service.findMany({
    where: serviceWhere,
    select: { id: true },
  });

  return matchingServices.map((service) => service.id);
}

export function buildPlanWhereClause({ allowedServiceIds, search }) {
  const andConditions = [];

  if (allowedServiceIds) {
    andConditions.push({ serviceId: { in: allowedServiceIds } });
  }

  if (search) {
    andConditions.push({
      OR: [
        { name: buildInsensitiveContains(search) },
        { tag: buildInsensitiveContains(search) },
        { description: buildInsensitiveContains(search) },
        { price: buildInsensitiveContains(search) },
        { service: { name: buildInsensitiveContains(search) } },
        { service: { slug: buildInsensitiveContains(search) } },
        { service: { category: { name: buildInsensitiveContains(search) } } },
        { service: { subcategory: { name: buildInsensitiveContains(search) } } },
      ],
    });
  }

  return andConditions.length ? { AND: andConditions } : {};
}

export function formatPlanRecord(plan) {
  return {
    ...plan,
    serviceSlug: plan.service?.slug || null,
    serviceName: plan.service?.name || null,
    categoryName: plan.service?.category?.name || null,
    subcategoryName: plan.service?.subcategory?.name || null,
    service: undefined,
  };
}
