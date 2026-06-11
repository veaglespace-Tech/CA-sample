import "dotenv/config";
import { prisma } from "../src/db.js";

const API_URL = "http://localhost:5000";

async function testSpecializationService() {
  console.log("Step 1: Simulating form submission to /api/consult (for Finance Lawyers)...");

  const testData = {
    fullName: "Test Finance Lawyer Lead",
    email: "finance_test@example.com",
    phone: "9998887776",
    service: "Finance Lawyers",
    city: "Mumbai",
    businessName: "Test Corp",
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
      console.log("Step 1 Success: API responded with 201 Created.");

      const leadId = result.data.id;
      console.log(`Lead ID: ${leadId}`);

      console.log("\nStep 2: Verifying data in the Lead table...");
      const lead = await prisma.lead.findUnique({
        where: { id: leadId }
      });

      if (lead) {
        console.log("Step 2 Success: Data found in Lead table.");
        console.log(`- Stored Name: ${lead.fullName}`);
        console.log(`- Stored Phone: ${lead.phone}`);
        console.log(`- Stored Service: ${lead.serviceName}`);
        console.log(`- Stored City: ${lead.city}`);
        console.log(`- Stored Form Type: ${lead.formType}`);
        console.log(`- Stored Source: ${lead.source}`);
      } else {
        console.error("Step 2 Failed: Data NOT found in Lead table.");
      }
    } else {
      console.error("Step 1 Failed: API responded with error.");
      console.error(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error("Test failed due to error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testSpecializationService();
