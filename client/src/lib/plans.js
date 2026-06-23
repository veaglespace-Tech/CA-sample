export const PLAN_PAGE_SIZE = 10;

export function normalizeSlug(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildPlansQueryParams({
  page = 1,
  limit = PLAN_PAGE_SIZE,
  search = "",
  categoryId = "",
  subcategoryId = "",
  serviceSlug = "",
} = {}) {
  const query = new URLSearchParams();
  const entries = {
    page,
    limit,
    search: String(search).trim(),
    categoryId,
    subcategoryId,
    serviceSlug,
  };

  Object.entries(entries).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "ALL") {
      query.set(key, String(value));
    }
  });

  return query;
}
