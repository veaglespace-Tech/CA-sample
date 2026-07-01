/**
 * Seed script: Insert all static reviews into the database
 * Run: node prisma/seed-reviews.js
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const REVIEWS = [
  {
    name: "Sanjivani Awale",
    rating: 5,
    service: "Company Registration",
    serviceSlug: "company-registration",
    isGeneral: false,
    text: "Veagle Space made our Private Limited Company registration incredibly seamless. Their CA team handled all the DSC, DIN, and ROC filings with absolute professionalism. Highly recommended for startups!",
    status: "PUBLISHED",
    sortOrder: 1,
    location: "Mumbai, MH"
  },
  {
    name: "Rahul Sharma",
    rating: 5,
    service: "GST Registration",
    serviceSlug: "gst-registration",
    isGeneral: false,
    text: "I was struggling with my GST registration until I found Veagle Space. They got my GSTIN within just 3 days! Their ongoing support for monthly GST returns is also exceptional.",
    status: "PUBLISHED",
    sortOrder: 2,
    location: "Pune, MH"
  },
  {
    name: "Priya Mehta",
    rating: 5,
    service: "Trademark Registration",
    serviceSlug: "trademark-registration",
    isGeneral: false,
    text: "Filing a trademark seemed daunting, but the legal experts at Veagle Space guided me through every single step. They conducted the trademark search and filed the application flawlessly.",
    status: "PUBLISHED",
    sortOrder: 3,
    location: "Bangalore, KA"
  },
  {
    name: "Vikram Nair",
    rating: 5,
    service: "Accounting & Bookkeeping",
    serviceSlug: "accounting-bookkeeping",
    isGeneral: false,
    text: "Outsourcing our bookkeeping to Veagle Space was the best decision for our agency. Their dedicated accountants keep our books updated, ensuring we are always audit-ready.",
    status: "PUBLISHED",
    sortOrder: 4,
    location: "Kochi, KL"
  },
  {
    name: "Anita Desai",
    rating: 5,
    service: "Income Tax Return Filing",
    serviceSlug: "income-tax-return-filing",
    isGeneral: false,
    text: "Quick, professional, and very transparent pricing. The CA assigned to me by Veagle Space was very knowledgeable and helped me maximize my tax deductions legally.",
    status: "PUBLISHED",
    sortOrder: 5,
    location: "Delhi, DL"
  },
  {
    name: "Suresh Reddy",
    rating: 5,
    service: "LLP Registration",
    serviceSlug: "llp-registration",
    isGeneral: false,
    text: "We wanted to register an LLP and Veagle Space executed it perfectly. They drafted the LLP agreement tailored to our needs. A truly hassle-free and premium experience.",
    status: "PUBLISHED",
    sortOrder: 6,
    location: "Hyderabad, TS"
  },
  {
    name: "Rajesh Kumar",
    rating: 5,
    service: "ISO Certification",
    serviceSlug: "iso-certification",
    isGeneral: false,
    text: "The team at Veagle Space guided us through the entire ISO 9001 certification process. Very clear communication, zero hidden costs, and timely delivery.",
    status: "PUBLISHED",
    sortOrder: 7,
    location: "Chennai, TN"
  },
  {
    name: "Neha Gupta",
    rating: 5,
    service: "Startup India Registration",
    serviceSlug: null,
    isGeneral: true,
    text: "Veagle Space helped my tech startup get DPIIT recognized effortlessly. They explained all the tax exemptions clearly and handled the complex paperwork. Outstanding CA firm!",
    status: "PUBLISHED",
    sortOrder: 8,
    location: "Noida, UP"
  },
  {
    name: "Amit Patel",
    rating: 5,
    service: "FSSAI Registration",
    serviceSlug: "fssai-registration",
    isGeneral: false,
    text: "For my new restaurant, getting the FSSAI license was my top priority. Veagle Space procured the central license for us without us having to visit any government office.",
    status: "PUBLISHED",
    sortOrder: 9,
    location: "Ahmedabad, GJ"
  },
  {
    name: "Deepika Joshi",
    rating: 5,
    service: null,
    serviceSlug: null,
    isGeneral: true,
    text: "Veagle Space is a one-stop solution for all compliance and legal needs. From company incorporation to annual ROC filings, their team is always available, polite, and strictly adheres to deadlines.",
    status: "PUBLISHED",
    sortOrder: 10,
    location: "Jaipur, RJ"
  },
  {
    name: "Kiran Patil",
    rating: 5,
    service: "MSME Registration",
    serviceSlug: "msme-udyam-registration",
    isGeneral: false,
    text: "Got our MSME Udyam certificate in record time. Veagle Space has a very transparent process with zero hidden charges. Highly satisfied with their quick turnaround.",
    status: "PUBLISHED",
    sortOrder: 11,
    location: "Nagpur, MH"
  },
  {
    name: "Meera Iyer",
    rating: 5,
    service: null,
    serviceSlug: null,
    isGeneral: true,
    text: "The CAs and legal experts at Veagle Space are truly world-class. Fast, reliable, and completely trustworthy. I confidently recommend their services to every business founder I know.",
    status: "PUBLISHED",
    sortOrder: 12,
    location: "Chennai, TN"
  },
];

async function main() {
  console.log("🌱 Seeding reviews into database...");

  let added = 0;
  let skipped = 0;

  for (const review of REVIEWS) {
    // Check if a review with the same name and text already exists
    const existing = await prisma.review.findFirst({
      where: { name: review.name, text: review.text },
    });

    if (existing) {
      console.log(`  ⏭  Skipping (already exists): ${review.name}`);
      skipped++;
      continue;
    }

    await prisma.review.create({ data: review });
    console.log(`  ✅ Added: ${review.name}`);
    added++;
  }

  console.log(`\n✨ Done! Added ${added} reviews, skipped ${skipped} duplicates.`);
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

