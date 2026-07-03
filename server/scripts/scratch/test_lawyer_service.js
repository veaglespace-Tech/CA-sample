import "dotenv/config";
import { prisma } from "../db.js";


const API_URL = "http://localhost:5000";

async function testLawyerService() {
  console.log("Step 1: Simulating form submission to /api/talk-to-expert...");

  const testData = {
    fullName: "Test Lawyer Lead",
    email: "test_lawyer@example.com",
    phone: "1234567890",
    serviceName: "Lawyer - Family Lawyers",
    message: "Mutual Divorce",
    pagePath: "/talk-to-a-lawyer",
    metadata: {
      language: "English",
      problemCategory: "Family Lawyers",
      problemType: "Mutual Divorce",
      whatsapp: true,
    },
  };

  try {
    const response = await fetch(`${API_URL}/api/talk-to-expert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(testData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log("Step 1 Success: API responded with 201 Created.");
      // console.log(JSON.stringify(result, null, 2));

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
        console.log(`- Stored Page Path: ${lead.pagePath}`);
        console.log(`- Stored Metadata: ${JSON.stringify(lead.metadata)}`);
        console.log(`- Stored Form Type: ${lead.formType}`);
        console.log(`- Stored Source: ${lead.source}`);
      } else {
        console.error("Step 2 Failed: Data NOT found in Lead table even after 201 response.");
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

testLawyerService();
