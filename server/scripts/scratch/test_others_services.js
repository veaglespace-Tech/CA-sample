import "dotenv/config";
import { prisma } from "../db.js";

const API_URL = "http://localhost:5000";

async function testOthersServices() {
  const servicesToTest = [
    { name: "Fundraising", slug: "fundraising", table: "Lead", endpoint: "/api/consult" },
    { name: "NGO Registration", slug: "ngo-registration", table: "RegistrationLead", endpoint: "/api/registration" },
    { name: "Marriage Registration", slug: "marriage-registration", table: "RegistrationLead", endpoint: "/api/registration" },
    { name: "Immigration", slug: "immigration", table: "Lead", endpoint: "/api/consult" }
  ];

  console.log(`Testing ${servicesToTest.length} services from "Others" tab...\n`);

  for (const service of servicesToTest) {
    console.log(`--- Testing: ${service.name} (Expected Table: ${service.table}) ---`);

    const testData = {
      fullName: `Test ${service.name} Lead`,
      email: `test_${service.slug}@example.com`,
      phone: "7776665554",
      service: service.name,
      city: "Delhi",
      whatsapp: true,
      registrationType: service.table === "RegistrationLead" ? "OTHER" : undefined
    };

    try {
      const response = await fetch(`${API_URL}${service.endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
      });

      const result = await response.json();

      if (response.ok) {
        console.log(`Step 1 Success: API responded with 201 Created for ${service.name}.`);
        const leadId = result.data.id;

        let lead;
        if (service.table === "Lead") {
          lead = await prisma.lead.findUnique({ where: { id: leadId } });
        } else {
          lead = await prisma.registrationLead.findUnique({ where: { id: leadId } });
        }

        if (lead) {
          console.log(`Step 2 Success: Data found in ${service.table} for ${service.name}.`);
          console.log(`- Stored Name: ${lead.fullName}`);
        } else {
          console.error(`Step 2 Failed: Data NOT found in ${service.table} for ${service.name}.`);
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

testOthersServices();
