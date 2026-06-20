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
    text: "Registration, Filing, and Legal help in one place just makes sense. The process was smooth and the team was very helpful throughout.",
    status: "PUBLISHED",
    sortOrder: 1,
  },
  {
    name: "Rahul Sharma",
    rating: 5,
    service: "GST Registration",
    serviceSlug: "gst-registration",
    isGeneral: false,
    text: "Got my GST number within 3 days. The team was responsive and handled everything professionally. Highly recommend!",
    status: "PUBLISHED",
    sortOrder: 2,
  },
  {
    name: "Priya Mehta",
    rating: 5,
    service: "Trademark Registration",
    serviceSlug: "trademark-registration",
    isGeneral: false,
    text: "Filed my trademark without any hassle. Expert guidance at every step. Will definitely use again for renewals.",
    status: "PUBLISHED",
    sortOrder: 3,
  },
  {
    name: "Vikram Nair",
    rating: 4,
    service: "Private Limited Company",
    serviceSlug: "private-limited-company",
    isGeneral: false,
    text: "Excellent service. All documents were handled efficiently. Minor delay in one document but overall great experience.",
    status: "PUBLISHED",
    sortOrder: 4,
  },
  {
    name: "Anita Desai",
    rating: 5,
    service: "Income Tax Return Filing",
    serviceSlug: "income-tax-return-filing",
    isGeneral: false,
    text: "Quick, professional and affordable. My CA was very knowledgeable and helped me maximize my deductions.",
    status: "PUBLISHED",
    sortOrder: 5,
  },
  {
    name: "Suresh Reddy",
    rating: 5,
    service: "LLP Registration",
    serviceSlug: "llp-registration",
    isGeneral: false,
    text: "Veagle Space made LLP registration completely hassle-free. Would highly recommend to any entrepreneur.",
    status: "PUBLISHED",
    sortOrder: 6,
  },
  {
    name: "Rajesh Kumar",
    rating: 5,
    service: "ISO Certification",
    serviceSlug: "iso-certification",
    isGeneral: false,
    text: "The team guided us through the entire ISO process. Very clear communication and timely delivery.",
    status: "PUBLISHED",
    sortOrder: 7,
  },
  {
    name: "Neha Gupta",
    rating: 5,
    service: "Startup India Registration",
    serviceSlug: null,
    isGeneral: true,
    text: "Helped me register my startup effortlessly. They explained all the tax benefits clearly. Outstanding service.",
    status: "PUBLISHED",
    sortOrder: 8,
  },
  {
    name: "Amit Patel",
    rating: 4,
    service: "Accounting & Bookkeeping",
    serviceSlug: "accounting-bookkeeping",
    isGeneral: false,
    text: "Our accounts are now perfectly managed. The dashboard is easy to use and their accountants are top-notch.",
    status: "PUBLISHED",
    sortOrder: 9,
  },
  {
    name: "Deepika Joshi",
    rating: 5,
    service: null,
    serviceSlug: null,
    isGeneral: true,
    text: "Exceptional service from start to finish. The team was always available to answer our questions and guided us every step of the way.",
    status: "PUBLISHED",
    sortOrder: 10,
  },
  {
    name: "Kiran Patil",
    rating: 5,
    service: "MSME Registration",
    serviceSlug: "msme-udyam-registration",
    isGeneral: false,
    text: "Got our MSME certificate in record time. Transparent process, zero hidden charges. Very satisfied with the service.",
    status: "PUBLISHED",
    sortOrder: 11,
  },
  {
    name: "Meera Iyer",
    rating: 5,
    service: null,
    serviceSlug: null,
    isGeneral: true,
    text: "The experts at Veagle Space are truly world-class. Fast, reliable and completely trustworthy. I recommend them to every business owner I know.",
    status: "PUBLISHED",
    sortOrder: 12,
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

