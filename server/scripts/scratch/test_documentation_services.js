import "dotenv/config";
import { prisma } from "../src/db.js";

const API_URL = "http://localhost:5000";

async function testDocumentationServices() {
  const servicesToTest = [
    { name: "Rental Agreement", slug: "rental-agreement" },
    { name: "Non Disclosure Agreement NDA", slug: "non-disclosure-agreement-nda" },
    { name: "Power of Attorney", slug: "power-of-attorney" }
  ];

  console.log(`Testing ${servicesToTest.length} Documentation services...\n`);

  for (const service of servicesToTest) {
    console.log(`--- Testing: ${service.name} ---`);

    const testData = {
      fullName: `Test ${service.name} Lead`,
      email: `test_${service.slug}@example.com`,
      phone: "8887776665",
      service: service.name,
      city: "Bangalore",
      whatsapp: true,
    };

    try {
      const response = await fetch(`${API_URL}/api/consult`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`Step 1 Success: API responded with 201 Created for ${service.name}.`);
        const leadId = result.data.id;

        const lead = await prisma.lead.findUnique({
          where: { id: leadId }
        });

        if (lead) {
          console.log(`Step 2 Success: Data found in Lead table for ${service.name}.`);
          console.log(`- Stored Name: ${lead.fullName}`);
          console.log(`- Stored Service: ${lead.serviceName}`);
        } else {
          console.error(`Step 2 Failed: Data NOT found in Lead table for ${service.name}.`);
        }
      } else {
        console.error(`Step 1 Failed: API responded with error for ${service.name}.`);
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error(`Test failed for ${service.name} due to error:`, error.message);
    }
    console.log("\n");
  }

  await prisma.$disconnect();
}

testDocumentationServices();
