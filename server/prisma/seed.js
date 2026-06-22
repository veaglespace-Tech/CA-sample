import "dotenv/config";
import prismaClientPkg from "@prisma/client";

const { PrismaClient } = prismaClientPkg;

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing. Add it to server/.env before seeding.");
}

const prisma = new PrismaClient();

const catalog = [
  {
    category: "Business Registration",
    subcategory: "Company Registration",
    services: [
      {
        name: "Private Limited Company",
        slug: "private-limited-company-registration",
        shortDesc: "Register a private limited company with expert MCA filing support.",
        price: "Rs. 6,999",
        govtFees: "+ Govt. Fees",
        timeToComplete: "7 Working Days",
        features: ["MCA filing assistance", "MOA and AOA drafting", "DSC and DIN guidance"],
        documents: ["PAN of directors", "Aadhaar of directors", "Office address proof"],
      },
      {
        name: "Limited Liability Partnership",
        slug: "llp-registration",
        shortDesc: "Register an LLP for professional and service businesses.",
        price: "Rs. 4,999",
        govtFees: "+ Govt. Fees",
        timeToComplete: "10-15 Working Days",
        features: ["Name approval guidance", "LLP agreement support", "MCA filing assistance"],
        documents: ["PAN of partners", "Aadhaar of partners", "Registered office proof"],
      },
      {
        name: "One Person Company",
        slug: "one-person-company",
        shortDesc: "Start a company with a single owner and limited liability.",
        price: "Talk to Expert",
        govtFees: "As applicable",
        timeToComplete: "7-10 Working Days",
      },
    ],
  },
  {
    category: "Tax & Compliance",
    subcategory: "GST and Other Indirect Tax",
    services: [
      {
        name: "GST Registration",
        slug: "gst-registration",
        shortDesc: "Get GSTIN with expert document review and application support.",
        price: "Rs. 1,499",
        govtFees: "Govt. Fees NIL",
        timeToComplete: "3-5 Working Days",
        features: ["GST portal application", "CA document review", "GST advisory onboarding"],
        documents: ["PAN Card", "Aadhaar Card", "Business address proof", "Bank account statement"],
      },
      {
        name: "GST Filing",
        slug: "gst-return-filing",
        shortDesc: "Monthly and quarterly GST return filing support.",
        price: "Talk to Expert",
        govtFees: "As applicable",
        timeToComplete: "Quick Callback",
      },
      {
        name: "Income Tax Return",
        slug: "income-tax-return",
        shortDesc: "ITR filing support for individuals, proprietors, and businesses.",
        price: "Talk to Expert",
        govtFees: "As applicable",
        timeToComplete: "Quick Callback",
      },
    ],
  },
  {
    category: "Trademark & IP",
    subcategory: "Trademark",
    services: [
      {
        name: "Trademark Registration",
        slug: "trademark-registration",
        shortDesc: "Protect your brand name, logo, and slogan.",
        price: "Rs. 6,999",
        govtFees: "+ Govt. Fees",
        timeToComplete: "Application in 3 Days",
        features: ["Trademark search", "Class selection", "Application filing"],
        documents: ["Brand name or logo", "Business proof", "PAN Card", "Address proof"],
      },
      {
        name: "Trademark Search",
        slug: "trademark-search",
        shortDesc: "Check trademark availability before filing.",
        price: "Talk to Expert",
        govtFees: "As applicable",
        timeToComplete: "Quick Callback",
      },
    ],
  },
  {
    category: "Consult an Expert",
    subcategory: "Expert Consultation",
    services: [
      {
        name: "Talk to a Lawyer",
        slug: "talk-to-a-lawyer",
        shortDesc: "Book a legal consultation with an expert lawyer.",
        price: "Talk to Expert",
        govtFees: "No govt. fees",
        timeToComplete: "Quick Callback",
      },
      {
        name: "Talk to a Chartered Accountant",
        slug: "chartered-accountant-services",
        shortDesc: "Speak with a CA for tax, accounting, and compliance guidance.",
        price: "Talk to Expert",
        govtFees: "No govt. fees",
        timeToComplete: "Quick Callback",
      },
    ],
  },
];

async function upsertService(category, subcategory, service, sortOrder) {
  const created = await prisma.service.upsert({
    where: { slug: service.slug },
    update: {
      name: service.name,
      shortDesc: service.shortDesc,
      price: service.price,
      govtFees: service.govtFees,
      timeToComplete: service.timeToComplete,
      categoryId: category.id,
      subcategoryId: subcategory.id,
      isActive: true,
    },
    create: {
      name: service.name,
      slug: service.slug,
      shortDesc: service.shortDesc,
      price: service.price,
      govtFees: service.govtFees,
      timeToComplete: service.timeToComplete,
      categoryId: category.id,
      subcategoryId: subcategory.id,
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

  const features = service.features || ["Dedicated expert callback", "Document checklist", "End-to-end support"];
  const documents = service.documents || ["Identity proof", "Address proof", "Business details"];
  const process = ["Submit Details", "Expert Callback", "Document Review", "Filing or Consultation", "Completion Update"];

  await Promise.all([
    prisma.serviceFeature.createMany({
      data: features.map((title, index) => ({ serviceId: created.id, title, sortOrder: index })),
    }),
    prisma.serviceDocument.createMany({
      data: documents.map((title, index) => ({ serviceId: created.id, title, sortOrder: index })),
    }),
    prisma.serviceProcessStep.createMany({
      data: process.map((title, index) => ({ serviceId: created.id, title, sortOrder: index })),
    }),
    prisma.serviceBenefit.createMany({
      data: [
        { serviceId: created.id, title: "Expert Guidance", desc: "Get professional guidance at each step.", sortOrder: 0 },
        { serviceId: created.id, title: "Transparent Pricing", desc: "Know scope and pricing before work begins.", sortOrder: 1 },
        { serviceId: created.id, title: "Fast Support", desc: "Move faster with a dedicated assistance workflow.", sortOrder: 2 },
      ],
    }),
    prisma.serviceFaq.createMany({
      data: [
        { serviceId: created.id, question: "How does the process start?", answer: "Submit your details and our expert will call you.", sortOrder: 0 },
        { serviceId: created.id, question: "Are government fees included?", answer: "Government fees depend on the service and will be confirmed before filing.", sortOrder: 1 },
      ],
    }),
  ]);

  await prisma.service.update({
    where: { id: created.id },
    data: { content: { seeded: true, sortOrder } },
  });
}



function getPackages(serviceObj) {
  const price = serviceObj.price || "1499";
  const oldPrice = serviceObj.oldPrice || null;
  const shortTitle = serviceObj.shortTitle || serviceObj.name || "Service";

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

async function seedPlans() {
  await prisma.servicePricingPlan.deleteMany({});
  
  const services = await prisma.service.findMany({
    select: { id: true, slug: true, name: true, price: true }
  });

  for (const service of services) {
    // Attempt to parse old price based on current price for fallback
    let fallbackOldPrice = null;
    if (service.price && !isNaN(parseInt(service.price.replace(/[^0-9]/g, "")))) {
        const pNum = parseInt(service.price.replace(/[^0-9]/g, ""));
        fallbackOldPrice = (pNum + Math.floor(pNum * 0.5)).toString(); // 50% higher
    }

    const serviceObj = { 
      name: service.name, 
      shortTitle: service.name,
      price: service.price || "1499",
      oldPrice: fallbackOldPrice
    };
    
    const packages = getPackages(serviceObj);

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
    }
  }
  console.log(`Seeded ServicePricingPlan for ${services.length} services.`);
}

// END_PLANS_INJECTION

async function main() {
  for (const [categoryIndex, group] of catalog.entries()) {
    const category = await prisma.serviceCategory.upsert({
      where: { slug: group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") },
      update: { name: group.category, sortOrder: categoryIndex, isActive: true },
      create: {
        name: group.category,
        slug: group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        sortOrder: categoryIndex,
        isActive: true,
      },
    });

    const subcategory = await prisma.serviceSubcategory.upsert({
      where: {
        categoryId_slug: {
          categoryId: category.id,
          slug: group.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        },
      },
      update: { name: group.subcategory, sortOrder: 0, isActive: true },
      create: {
        categoryId: category.id,
        name: group.subcategory,
        slug: group.subcategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
        sortOrder: 0,
        isActive: true,
      },
    });

    for (const [serviceIndex, service] of group.services.entries()) {
      await upsertService(category, subcategory, service, serviceIndex);
    }
  }

  await seedPlans();

  await prisma.siteSetting.upsert({
    where: { key: "site_contact" },
    update: {
      value: {
        phone: "+91 82379 99101",
        email: "info@veaglespace.com",
      },
    },
    create: {
      key: "site_contact",
      value: {
        phone: "+91 82379 99101",
        email: "info@veaglespace.com",
      },
    },
  });
}

main()
  .then(async () => {
    console.log("Database seeded");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
