const Database = require('better-sqlite3');
const db = new Database('./prisma/dev.db');
const cuid = () => 'c' + Math.random().toString(36).substr(2, 25) + Date.now().toString(36);
const now = new Date().toISOString();

// Check review count
const count = db.prepare('SELECT COUNT(*) as c FROM "Review"').get();
console.log('Current review count:', count.c);

if (count.c >= 14) {
  console.log('Already seeded! Skipping.');
  db.close();
  process.exit(0);
}

// Check columns
const cols = db.prepare("PRAGMA table_info('Review')").all();
const colNames = cols.map(c => c.name);
console.log('Columns:', colNames.join(', '));

const hasServiceSlug = colNames.includes('serviceSlug');
const hasIsGeneral = colNames.includes('isGeneral');
const hasLocation = colNames.includes('location');

// Add missing columns
if (!hasServiceSlug) {
  db.exec('ALTER TABLE "Review" ADD COLUMN "serviceSlug" TEXT');
  console.log('Added serviceSlug');
}
if (!hasIsGeneral) {
  db.exec('ALTER TABLE "Review" ADD COLUMN "isGeneral" INTEGER NOT NULL DEFAULT 1');
  console.log('Added isGeneral');
}
if (!hasLocation) {
  db.exec('ALTER TABLE "Review" ADD COLUMN "location" TEXT');
  console.log('Added location');
}

// Seed reviews
const reviews = [
  { name: 'Sanjivani Awale', rating: 5, service: 'Company Registration', serviceSlug: 'private-limited-company', text: 'Registration, Filing, and Legal help in one place just makes sense. The process was smooth and the team was very helpful throughout.', isGeneral: 0, status: 'PUBLISHED', sortOrder: 1 },
  { name: 'Rahul Sharma', rating: 5, service: 'GST Registration', serviceSlug: 'gst-registration', text: 'Got my GST number within 3 days. The team was responsive and handled everything professionally. Highly recommend!', isGeneral: 0, status: 'PUBLISHED', sortOrder: 2 },
  { name: 'Priya Mehta', rating: 5, service: 'Trademark Registration', serviceSlug: 'trademark-registration', text: 'Filed my trademark without any hassle. Expert guidance at every step. Will definitely use again for renewals.', isGeneral: 0, status: 'PUBLISHED', sortOrder: 3 },
  { name: 'Vikram Nair', rating: 4, service: 'Pvt Ltd Registration', serviceSlug: 'private-limited-company', text: 'Excellent service. All documents were handled efficiently. Minor delay in one document but overall great experience.', isGeneral: 0, status: 'PUBLISHED', sortOrder: 4 },
  { name: 'Anita Desai', rating: 5, service: 'Income Tax Filing', serviceSlug: 'income-tax-return-filing', text: 'Quick, professional and affordable. My CA was very knowledgeable and helped me maximize my deductions.', isGeneral: 0, status: 'PUBLISHED', sortOrder: 5 },
  { name: 'Suresh Reddy', rating: 5, service: 'LLP Registration', serviceSlug: 'llp-registration', text: 'Value Expert made LLP completely hassle-free. Would highly recommend to any entrepreneur.', isGeneral: 0, status: 'PUBLISHED', sortOrder: 6 },
  { name: 'Rajesh Kumar', rating: 5, service: 'ISO Certification', serviceSlug: 'iso-certification', text: 'The team guided us through the entire ISO process. Very clear communication and timely delivery.', isGeneral: 0, status: 'PUBLISHED', sortOrder: 7 },
  { name: 'Neha Gupta', rating: 5, service: 'Startup India Registration', serviceSlug: null, text: 'Helped me register my startup effortlessly. They explained all the tax benefits clearly. Outstanding service.', isGeneral: 1, status: 'PUBLISHED', sortOrder: 8 },
  { name: 'Amit Patel', rating: 4, service: 'Accounting and Bookkeeping', serviceSlug: 'accounting-bookkeeping', text: 'Our accounts are now perfectly managed. The dashboard is easy to use and their accountants are top-notch.', isGeneral: 0, status: 'PUBLISHED', sortOrder: 9 },
  { name: 'Kalpesh Salunke', rating: 5, service: null, serviceSlug: null, text: 'The Valuexpert team is truly amazing. They helped me resolve my property dispute efficiently and professionally.', isGeneral: 1, status: 'PUBLISHED', sortOrder: 10 },
  { name: 'Jasveer Singh', rating: 5, service: null, serviceSlug: null, text: 'Received a wonderful consultation regarding my civil matter at a very affordable cost. Highly recommended!', isGeneral: 1, status: 'PUBLISHED', sortOrder: 11 },
  { name: 'Sumit Kumar', rating: 5, service: null, serviceSlug: null, text: 'I had a great experience with Valuexpert. Their team helped me resolve my GST issue smoothly and guided me through the process.', isGeneral: 1, status: 'PUBLISHED', sortOrder: 12 },
  { name: 'Rishabh Parihaar', rating: 5, service: null, serviceSlug: null, text: 'As an entrepreneur, I value efficiency and clarity and Valuexpert delivered both. Their legal team is proactive and professional.', isGeneral: 1, status: 'PUBLISHED', sortOrder: 13 },
  { name: 'Mrudul Ramakrishnan', rating: 5, service: null, serviceSlug: null, text: 'All my doubts were cleared and answered. Satisfied with the consultation. Will definitely come back for future needs.', isGeneral: 1, status: 'PUBLISHED', sortOrder: 14 },
];

const insert = db.prepare(`
  INSERT INTO "Review" (id, name, rating, service, serviceSlug, isGeneral, text, status, sortOrder, createdAt, updatedAt)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertAll = db.transaction((revs) => {
  for (const r of revs) {
    insert.run(cuid(), r.name, r.rating, r.service || null, r.serviceSlug || null, r.isGeneral, r.text, r.status, r.sortOrder, now, now);
    console.log('✅ Created:', r.name);
  }
});

insertAll(reviews);

const newCount = db.prepare('SELECT COUNT(*) as c FROM "Review"').get();
console.log('\n🎉 Done! Total reviews:', newCount.c);
db.close();
