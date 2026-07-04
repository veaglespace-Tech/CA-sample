import { serviceData } from "../../client/data/services.js";

const normalizeSlug = (value = "") =>
  String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function buildPackages(service) {
  const price = String(service.price || "1499");
  const oldPrice = service.oldPrice ? String(service.oldPrice) : null;
  const shortTitle = service.title || service.shortTitle || service.name || "Service";

  if (service.slug === "gst-registration") {
    return [
      {
        name: "Standard",
        description: "48-hours fast track GST application",
        oldPrice: "799",
        price: "399",
        tag: "50% off",
        isHighlighted: false,
        features: ["GST form filing in under 48 hours", "GST certificate support"],
        sortOrder: 1,
      },
      {
        name: "Premium",
        description: "24-hours fast track GST application",
        oldPrice: "3999",
        price: "1999",
        tag: "Recommended Plan",
        isHighlighted: true,
        features: [
          "GST application filed within 24 hours",
          "GST registration completed in eligible cases",
          "Error-free documentation review",
          "ARN generated on priority basis",
          "Free GST compliance checklist",
          "Dedicated GST expert support",
        ],
        sortOrder: 2,
      },
      {
        name: "Custom Plan",
        description: "Perfect for registration and tax filings",
        oldPrice: null,
        price: "Custom Quote",
        tag: "Tailored",
        isHighlighted: false,
        features: ["Expert assisted process", "GST registration", "MSME registration guidance", "GST filing support for 12 months"],
        sortOrder: 3,
      },
    ];
  }

  const cleanStr = (str) => {
    if (!str) return null;
    const match = str.match(/[0-9,]+(?:\.[0-9]+)?/);
    return match ? match[0].replace(/,/g, "") : null;
  };

  const numericPrice = cleanStr(price);
  const numericOldPrice = oldPrice ? cleanStr(oldPrice) : null;
  const resolvedPrice = numericPrice || "1499";
  const resolvedOldPrice = numericOldPrice || (numericPrice ? String(Math.round(Number(numericPrice) * 1.5)) : null);

  return [
    {
      name: "Standard",
      description: `Essential support for ${shortTitle}`,
      oldPrice: resolvedOldPrice,
      price: resolvedPrice,
      tag: "Starter",
      isHighlighted: false,
      features: ["Expert callback", "Document checklist", "Application preparation"],
      sortOrder: 1,
    },
    {
      name: "Premium",
      description: "Priority filing with expert review",
      oldPrice: resolvedOldPrice,
      price: resolvedPrice,
      tag: "Recommended Plan",
      isHighlighted: true,
      features: ["Everything in Standard", "Priority document review", "Filing support", "Dedicated expert coordination"],
      sortOrder: 2,
    },
    {
      name: "Custom Plan",
      description: "End-to-end managed support tailored to your needs",
      oldPrice: null,
      price: "Custom Quote",
      tag: "Tailored",
      isHighlighted: false,
      features: ["Everything in Premium", "Additional compliance guidance", "Post-completion support", "Follow-up reminders"],
      sortOrder: 3,
    },
  ];
}

function buildSeedSource(service) {
  const slug = service.slug;
  const source = serviceData[slug] || {};
  return {
    name: source.title || source.shortTitle || source.name || service.name,
    title: source.title || source.shortTitle || source.name || service.name,
    shortTitle: source.shortTitle || source.title || source.name || service.name,
    price: source.price || service.price || "1499",
    oldPrice: source.oldPrice || null,
  };
}

export async function seedServicePlans(prisma, { logPrefix = "[seed_service_plans]" } = {}) {
  const services = await prisma.service.findMany({
    select: { id: true, slug: true, name: true, price: true },
    orderBy: [{ createdAt: "asc" }],
  });

  if (services.length === 0) {
    console.log(`${logPrefix} No services found. Skipping plan seed.`);
    return { services: 0, servicePricingPlans: 0, purchasePlans: 0 };
  }

  const [deletedServicePlans, deletedPurchasePlans] = await Promise.all([
    prisma.servicePricingPlan.deleteMany({}),
    prisma.purchasePlan.deleteMany({}),
  ]);

  const pricingRecords = [];
  const purchaseRecords = [];

  for (const service of services) {
    const seedSource = buildSeedSource(service);
    const packages = buildPackages({
      ...seedSource,
      name: service.name,
      title: seedSource.title,
    });

    for (const pkg of packages) {
      const baseRecord = {
        serviceId: service.id,
        name: pkg.name,
        description: pkg.description,
        price: pkg.price,
        oldPrice: pkg.oldPrice,
        tag: pkg.tag,
        isHighlighted: pkg.isHighlighted,
        features: pkg.features,
        sortOrder: pkg.sortOrder,
      };

      pricingRecords.push(baseRecord);
      purchaseRecords.push({
        ...baseRecord,
        serviceSlug: service.slug,
        isActive: true,
      });
    }
  }

  if (pricingRecords.length > 0) {
    await prisma.servicePricingPlan.createMany({ data: pricingRecords });
  }

  if (purchaseRecords.length > 0) {
    await prisma.purchasePlan.createMany({ data: purchaseRecords });
  }

  console.log(
    `${logPrefix} Replaced ${deletedServicePlans.count} service pricing plans and ${deletedPurchasePlans.count} purchase plans. ` +
      `Seeded ${pricingRecords.length} fresh plan records across ${services.length} services.`,
  );

  return {
    services: services.length,
    servicePricingPlans: pricingRecords.length,
    purchasePlans: purchaseRecords.length,
  };
}

export { buildPackages, normalizeSlug };
