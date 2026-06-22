import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { serviceData } from "../../client/src/data/services.js";

const prisma = new PrismaClient();

function getPackages(serviceSlug, serviceObj) {
  const price = serviceObj.price || "1499";
  const oldPrice = serviceObj.oldPrice || null;
  const shortTitle = serviceObj.shortTitle || serviceObj.title || "Service";

  if (shortTitle === "GST Registration") {
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

  const pNumeric = price.replace(/[^0-9.]/g, "");
  const opNumeric = oldPrice ? oldPrice.replace(/[^0-9.]/g, "") : null;

  return [
    {
      name: "Standard",
      description: `Essential support for ${shortTitle}`,
      oldPrice: opNumeric,
      price: pNumeric || "1499",
      tag: "Starter",
      isHighlighted: false,
      features: ["Expert callback", "Document checklist", "Application preparation"],
      sortOrder: 1,
    },
    {
      name: "Premium",
      description: "Priority filing with expert review",
      oldPrice: opNumeric,
      price: pNumeric || "1499",
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

async function main() {
  console.log("Starting ServicePricingPlan seeding...");

  // Get all existing services to attach plans to
  const services = await prisma.service.findMany({
    select: { id: true, slug: true, name: true }
  });

  if (services.length === 0) {
    console.log("No services found in DB. Please run db:seed first to populate services.");
    return;
  }

  console.log(`Found ${services.length} services. Deleting old pricing plans...`);
  await prisma.servicePricingPlan.deleteMany();
  
  let plansCreated = 0;

  for (const service of services) {
    const slug = service.slug;
    const serviceObj = serviceData[slug] || { title: service.name, price: "1499" };
    
    const packages = getPackages(slug, serviceObj);

    for (const pkg of packages) {
      await prisma.servicePricingPlan.create({
        data: {
          serviceId: service.id,
          name: pkg.name,
          description: pkg.description,
          price: pkg.price,
          oldPrice: pkg.oldPrice,
          tag: pkg.tag,
          isHighlighted: pkg.isHighlighted,
          features: pkg.features,
          sortOrder: pkg.sortOrder,
        },
      });
      plansCreated++;
    }
  }

  console.log(`Seeding complete. Created ${plansCreated} pricing plans.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
