const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

function getPackages(service) {
  // If no price is defined, provide a fallback.
  const price = service.price || "1499";
  const oldPrice = service.oldPrice || null;

  if (service.name === "GST Registration") {
    return [
      {
        name: "Standard",
        desc: "48-hours fast track GST application",
        oldPrice: "799",
        price: "399",
        tag: "50% off",
        isHighlighted: false,
        features: ["GST form filing in under 48 hours", "GST certificate support"],
        sortOrder: 1,
      },
      {
        name: "Premium",
        desc: "24-hours fast track GST application",
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
        desc: "Perfect for registration and tax filings",
        oldPrice: null,
        price: "Custom Quote",
        tag: "Tailored",
        isHighlighted: false,
        features: ["Expert assisted process", "GST registration", "MSME registration guidance", "GST filing support for 12 months"],
        sortOrder: 3,
      },
    ];
  }

  return [
    {
      name: "Standard",
      desc: `Essential support for ${service.name}`,
      oldPrice: oldPrice ? oldPrice.replace(/[^0-9.]/g, "") : null,
      price: price.replace(/[^0-9.]/g, ""), // Keep it generic but numeric string like "1999" or "4999"
      tag: "Starter",
      isHighlighted: false,
      features: ["Expert callback", "Document checklist", "Application preparation"],
      sortOrder: 1,
    },
    {
      name: "Premium",
      desc: "Priority filing with expert review",
      oldPrice: oldPrice ? oldPrice.replace(/[^0-9.]/g, "") : null,
      price: price.replace(/[^0-9.]/g, ""),
      tag: "Recommended Plan",
      isHighlighted: true,
      features: ["Everything in Standard", "Priority document review", "Filing support", "Dedicated expert coordination"],
      sortOrder: 2,
    },
    {
      name: "Custom Plan",
      desc: "End-to-end managed support tailored to your needs",
      oldPrice: null,
      price: "1499", // Provide a default or custom
      tag: "Tailored",
      isHighlighted: false,
      features: ["Everything in Premium", "Additional compliance guidance", "Post-completion support", "Follow-up reminders"],
      sortOrder: 3,
    },
  ];
}

async function main() {
  console.log("Starting ServicePricingPlan seeding...");

  // Clear existing pricing plans to avoid duplicates during seeding
  await prisma.servicePricingPlan.deleteMany();
  console.log("Cleared existing pricing plans.");

  const services = await prisma.service.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      // Note: oldPrice does not exist on Service model. 
      // We'll calculate a default oldPrice if needed.
    },
  });

  for (const service of services) {
    // Determine oldPrice if price is present
    let oldPrice = null;
    if (service.price && !isNaN(parseInt(service.price.replace(/[^0-9]/g, "")))) {
        const pNum = parseInt(service.price.replace(/[^0-9]/g, ""));
        oldPrice = (pNum + Math.floor(pNum * 0.5)).toString(); // 50% higher
    }
    
    // Add custom oldPrice attribute
    const serviceWithOldPrice = { ...service, oldPrice };
    const packages = getPackages(serviceWithOldPrice);

    for (const pkg of packages) {
      await prisma.servicePricingPlan.create({
        data: {
          serviceId: service.id,
          name: pkg.name,
          description: pkg.desc,
          price: pkg.price || "1499",
          oldPrice: pkg.oldPrice,
          tag: pkg.tag,
          isHighlighted: pkg.isHighlighted,
          features: pkg.features,
          sortOrder: pkg.sortOrder,
        },
      });
    }
    console.log(`Created plans for service: ${service.name}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
