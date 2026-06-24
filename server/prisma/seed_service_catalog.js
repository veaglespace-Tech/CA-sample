import { serviceData } from "../../client/src/data/services.js";
import { normalizeSlug } from "./seed_service_plans.js";

const TAB_ORDER = [
  "Business Registration",
  "Tax & Payroll",
  "Trademark & IP",
  "Compliances",
  "Documentation",
  "Others",
];

const CATEGORY_TO_TAB = {
  "Business Registration": "Business Registration",
  "NGO Registration": "Business Registration",
  "International Business Setup": "Business Registration",
  GST: "Tax & Payroll",
  "GST & Income Tax": "Tax & Payroll",
  "Trademark & IP": "Trademark & IP",
  "Licenses & Registrations": "Compliances",
  "Consult an Expert": "Others",
  "Web Development": "Others",
};

const DOCUMENTATION_SERVICE_SEED = [
  {
    slug: "rental-agreement",
    name: "Rental Agreement",
    shortDesc: "Draft and register a rental agreement with practical legal support.",
    price: "Rs. 999",
    oldPrice: "Rs. 1,499",
    govtFees: "As applicable",
    timeToComplete: "Quick Callback",
    features: ["Draft preparation", "Review support", "Easy finalization"],
    documents: ["Property details", "Tenant details", "Owner details"],
    process: ["Share requirements", "Draft agreement", "Review and finalize"],
    benefits: [
      { title: "Ready-to-use draft", desc: "Get a simple, professional rental agreement draft." },
      { title: "Quick support", desc: "Get help without navigating legal wording alone." },
    ],
    faqs: [
      { q: "Is this a generic rental agreement?", a: "Yes, it is a standard draft service with expert support." },
    ],
  },
  {
    slug: "nda",
    name: "NDA",
    shortDesc: "Create a non-disclosure agreement to protect confidential information.",
    price: "Rs. 1,499",
    oldPrice: "Rs. 2,499",
    govtFees: "As applicable",
    timeToComplete: "Quick Callback",
    features: ["Confidentiality clauses", "Custom drafting support", "Fast turnaround"],
    documents: ["Party names", "Scope of work", "Confidential information details"],
    process: ["Collect scope", "Draft NDA", "Finalize terms"],
    benefits: [
      { title: "Protects information", desc: "Helps protect confidential business details." },
      { title: "Tailored wording", desc: "Drafted to fit the transaction or engagement." },
    ],
    faqs: [
      { q: "Can NDA terms be customized?", a: "Yes, the draft can be adjusted to your needs." },
    ],
  },
  {
    slug: "employment-agreement",
    name: "Employment Agreement",
    shortDesc: "Prepare a clear employment agreement for hiring and onboarding.",
    price: "Rs. 1,999",
    oldPrice: "Rs. 2,999",
    govtFees: "As applicable",
    timeToComplete: "Quick Callback",
    features: ["Role-specific drafting", "Compliance-friendly clauses", "Simple onboarding"],
    documents: ["Employee details", "Designation", "Compensation structure"],
    process: ["Share role details", "Prepare agreement", "Review and sign"],
    benefits: [
      { title: "Clear expectations", desc: "Defines the employment relationship with clarity." },
      { title: "Faster onboarding", desc: "Makes hiring paperwork easier to complete." },
    ],
    faqs: [
      { q: "Is this suitable for startups?", a: "Yes, it works well for small teams and growing businesses." },
    ],
  },
  {
    slug: "offer-letter",
    name: "Offer Letter",
    shortDesc: "Draft an offer letter for new hires with the right terms included.",
    price: "Rs. 799",
    oldPrice: "Rs. 1,299",
    govtFees: "As applicable",
    timeToComplete: "Quick Callback",
    features: ["Offer letter drafting", "Role details support", "Professional formatting"],
    documents: ["Candidate name", "Role title", "Compensation details"],
    process: ["Share role details", "Prepare offer letter", "Review and send"],
    benefits: [
      { title: "Professional hiring docs", desc: "Keep hiring communication consistent." },
      { title: "Simple process", desc: "Get a draft quickly without starting from scratch." },
    ],
    faqs: [
      { q: "Can the letter be customized?", a: "Yes, the structure and wording can be adjusted." },
    ],
  },
];

const DEFAULT_FEATURES = [
  "Expert callback",
  "Document checklist",
  "Application preparation",
];

const DEFAULT_DOCUMENTS = [
  "Identity proof",
  "Address proof",
  "Business details",
];

const DEFAULT_PROCESS = [
  "Submit Details",
  "Expert Callback",
  "Document Review",
  "Filing or Consultation",
  "Completion Update",
];

const DEFAULT_BENEFITS = [
  { title: "Expert Guidance", desc: "Get professional guidance at each step." },
  { title: "Transparent Pricing", desc: "Know scope and pricing before work begins." },
  { title: "Fast Support", desc: "Move faster with a dedicated assistance workflow." },
];

const DEFAULT_FAQS = [
  {
    q: "How does the process start?",
    a: "Submit your details and our expert will call you.",
  },
  {
    q: "Are government fees included?",
    a: "Government fees depend on the service and will be confirmed before filing.",
  },
];

function getTabName(categoryName = "") {
  return CATEGORY_TO_TAB[categoryName] || "Others";
}

function buildServicePayload(slug, service, { placeholder = false } = {}) {
  const title = service.title || service.shortTitle || service.name || slug.replace(/-/g, " ");
  const shortTitle = service.shortTitle || service.name || title;

  return {
    slug,
    name: title,
    shortDesc:
      service.subtitle ||
      service.intro ||
      service.shortDesc ||
      `Professional support for ${shortTitle}`,
    price: service.price || "Talk to Expert",
    govtFees: service.govtFees || "As applicable",
    timeToComplete: service.timeframe || "Quick Callback",
    features: Array.isArray(service.features) && service.features.length > 0 ? service.features : DEFAULT_FEATURES,
    documents: Array.isArray(service.documents) && service.documents.length > 0 ? service.documents : DEFAULT_DOCUMENTS,
    process: Array.isArray(service.process) && service.process.length > 0 ? service.process : DEFAULT_PROCESS,
    benefits: Array.isArray(service.benefits) && service.benefits.length > 0 ? service.benefits : DEFAULT_BENEFITS,
    faqs: Array.isArray(service.faqs) && service.faqs.length > 0 ? service.faqs : DEFAULT_FAQS,
    content: {
      seeded: true,
      source: placeholder ? "documentation-placeholder" : "serviceData",
      category: service.category || "Documentation",
      title,
      shortTitle,
      label: service.name || shortTitle,
    },
  };
}

async function upsertRichService(prisma, { categoryName, subcategoryName, service, sortOrder = 0 }) {
  const categorySlug = normalizeSlug(categoryName);
  const subcategorySlug = normalizeSlug(subcategoryName);
  const tabCategory = await prisma.serviceCategory.upsert({
    where: { slug: categorySlug },
    update: { name: categoryName, sortOrder: TAB_ORDER.indexOf(categoryName), isActive: true },
    create: {
      name: categoryName,
      slug: categorySlug,
      sortOrder: TAB_ORDER.indexOf(categoryName),
      isActive: true,
    },
  });

  const serviceSubcategory = await prisma.serviceSubcategory.upsert({
    where: {
      categoryId_slug: {
        categoryId: tabCategory.id,
        slug: subcategorySlug,
      },
    },
    update: { name: subcategoryName, sortOrder, isActive: true },
    create: {
      categoryId: tabCategory.id,
      name: subcategoryName,
      slug: subcategorySlug,
      sortOrder,
      isActive: true,
    },
  });

  const payload = buildServicePayload(service.slug, service, { placeholder: Boolean(service.placeholder) });

  const created = await prisma.service.upsert({
    where: { slug: service.slug },
    update: {
      name: payload.name,
      shortDesc: payload.shortDesc,
      price: payload.price,
      govtFees: payload.govtFees,
      timeToComplete: payload.timeToComplete,
      categoryId: tabCategory.id,
      subcategoryId: serviceSubcategory.id,
      isActive: true,
    },
    create: {
      name: payload.name,
      slug: service.slug,
      shortDesc: payload.shortDesc,
      price: payload.price,
      govtFees: payload.govtFees,
      timeToComplete: payload.timeToComplete,
      categoryId: tabCategory.id,
      subcategoryId: serviceSubcategory.id,
      isActive: true,
    },
  });

  await Promise.all([
    prisma.serviceFeature.deleteMany({ where: { serviceId: created.id } }),
    prisma.serviceDocument.deleteMany({ where: { serviceId: created.id } }),
    prisma.serviceProcessStep.deleteMany({ where: { serviceId: created.id } }),
    prisma.serviceBenefit.deleteMany({ where: { serviceId: created.id } }),
    prisma.serviceFaq.deleteMany({ where: { serviceId: created.id } }),
  ]);

  await Promise.all([
    prisma.serviceFeature.createMany({
      data: payload.features.map((title, index) => ({ serviceId: created.id, title, sortOrder: index })),
    }),
    prisma.serviceDocument.createMany({
      data: payload.documents.map((title, index) => ({ serviceId: created.id, title, sortOrder: index })),
    }),
    prisma.serviceProcessStep.createMany({
      data: payload.process.map((title, index) => ({ serviceId: created.id, title, sortOrder: index })),
    }),
    prisma.serviceBenefit.createMany({
      data: payload.benefits.map((benefit, index) => ({
        serviceId: created.id,
        title: benefit.title,
        desc: benefit.desc,
        sortOrder: index,
      })),
    }),
    prisma.serviceFaq.createMany({
      data: payload.faqs.map((faq, index) => ({
        serviceId: created.id,
        question: faq.q,
        answer: faq.a,
        sortOrder: index,
      })),
    }),
  ]);

  await prisma.service.update({
    where: { id: created.id },
    data: { content: payload.content },
  });
}

export async function seedServiceCatalog(prisma) {
  const catalogEntries = Object.entries(serviceData);
  const targetServiceSlugs = new Set([
    ...catalogEntries.map(([slug]) => slug),
    ...DOCUMENTATION_SERVICE_SEED.map((service) => service.slug),
  ]);
  const targetSubcategorySlugs = new Set([
    ...catalogEntries.map(([, service]) => normalizeSlug(service.category || "General")),
    normalizeSlug("Document Drafting"),
  ]);
  const seededCategories = new Set();
  const allowedCategorySlugs = new Set(TAB_ORDER.map((tab) => normalizeSlug(tab)));

  await prisma.purchasePlan.deleteMany({});
  await prisma.service.deleteMany({
    where: {
      slug: {
        notIn: [...targetServiceSlugs],
      },
    },
  });

  for (const [index, [slug, service]] of catalogEntries.entries()) {
    const tabCategory = getTabName(service.category);
    if (!seededCategories.has(tabCategory)) {
      seededCategories.add(tabCategory);
      await prisma.serviceCategory.upsert({
        where: { slug: normalizeSlug(tabCategory) },
        update: { name: tabCategory, sortOrder: TAB_ORDER.indexOf(tabCategory), isActive: true },
        create: {
          name: tabCategory,
          slug: normalizeSlug(tabCategory),
          sortOrder: TAB_ORDER.indexOf(tabCategory),
          isActive: true,
        },
      });
    }

    await upsertRichService(prisma, {
      categoryName: tabCategory,
      subcategoryName: service.category || tabCategory,
      service: { ...service, slug },
      sortOrder: index,
    });
  }

  for (const [index, service] of DOCUMENTATION_SERVICE_SEED.entries()) {
    await upsertRichService(prisma, {
      categoryName: "Documentation",
      subcategoryName: "Document Drafting",
      service: { ...service, placeholder: true },
      sortOrder: index,
    });
  }

  const extraCategories = await prisma.serviceCategory.findMany({
    where: {
      slug: {
        notIn: [...allowedCategorySlugs],
      },
    },
    select: { id: true },
  });

  if (extraCategories.length > 0) {
    const extraCategoryIds = extraCategories.map((category) => category.id);
    await prisma.serviceSubcategory.deleteMany({
      where: {
        categoryId: { in: extraCategoryIds },
      },
    });
    await prisma.serviceCategory.deleteMany({
      where: {
        id: { in: extraCategoryIds },
      },
    });
  }

  const allowedCategories = await prisma.serviceCategory.findMany({
    where: {
      slug: {
        in: [...allowedCategorySlugs],
      },
    },
    select: { id: true },
  });

  if (allowedCategories.length > 0) {
    const allowedCategoryIds = allowedCategories.map((category) => category.id);
    await prisma.serviceSubcategory.deleteMany({
      where: {
        categoryId: { in: allowedCategoryIds },
        slug: { notIn: [...targetSubcategorySlugs] },
      },
    });
  }

  return {
    services: catalogEntries.length + DOCUMENTATION_SERVICE_SEED.length,
    categories: TAB_ORDER.length,
  };
}
