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



import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allPlans = JSON.parse(fs.readFileSync(path.join(__dirname, 'plans.json'), 'utf8'));

async function seedPlans() {
  await prisma.purchasePlan.deleteMany({});
  
  // Update serviceIds dynamically based on the newly generated Service IDs on the VPS
  for (const plan of allPlans) {
    let currentServiceId = null;
    
    // If the plan is attached to a service, find the new service ID by slug
    if (plan.serviceSlug) {
      const service = await prisma.service.findUnique({
        where: { slug: plan.serviceSlug }
      });
      if (service) {
        currentServiceId = service.id;
      }
    }
    
    plan.serviceId = currentServiceId;
    
    await prisma.purchasePlan.create({
      data: plan
    });
  }
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
