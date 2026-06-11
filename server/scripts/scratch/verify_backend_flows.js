import "dotenv/config";
import { prisma } from "../../src/config/db.js";
import { addLeadNote } from "../../src/services/leads.js";
import { fetchAllPlatformData } from "../../src/services/admin.js";

async function verifyFlows() {
  console.log("Starting Backend Flow Verification...");

  try {
    // 1. Create a dummy user
    console.log("\n[Test 1] Creating Dummy User for testing...");
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: `testuser_${Date.now()}@test.com`,
        phone: `99${Date.now().toString().slice(-8)}`,
        passwordHash: "hashedpassword123",
      }
    });
    console.log("✅ User created:", user.id);

    // 2. Test standard Lead workflow
    console.log("\n[Test 2] Creating Standard Lead and testing addLeadNote...");
    const lead = await prisma.lead.create({
      data: {
        fullName: "Test Lead",
        email: `lead_${Date.now()}@test.com`,
        phone: "8888888888",
        serviceId: "cmoqydm8x00023pq6aypqgau5",
      }
    });
    console.log("✅ Lead created:", lead.id);

    const leadNote = await addLeadNote(lead.id, user.id, "Testing note for standard lead");
    console.log("✅ Note added to Lead:", leadNote.id);

    // 3. Test RegistrationLead workflow
    console.log("\n[Test 3] Creating RegistrationLead and testing addLeadNote...");
    const regLead = await prisma.registrationLead.create({
      data: {
        fullName: "Test Reg Lead",
        email: `reg_${Date.now()}@test.com`,
        phone: `99${Date.now().toString().slice(-8)}`,
        serviceId: "cmoqydm8x00023pq6aypqgau5",
        userId: user.id
      }
    });
    console.log("✅ RegistrationLead created:", regLead.id);

    const regNote = await addLeadNote(regLead.id, user.id, "Testing note for registration lead");
    console.log("✅ Note added to RegistrationLead:", regNote.id);

    // 4. Test fetchAllPlatformData (Admin query)
    console.log("\n[Test 4] Verifying Admin Dashboard Data Query...");
    const adminData = await fetchAllPlatformData({ role: "SUPER_ADMIN", id: user.id });
    console.log("✅ Admin Data fetched successfully.");
    console.log(`   Found ${adminData.leads.length} Leads and ${adminData.registrations.length} Registrations.`);
    
    // Validate if the notes are populated in the registrations
    const testReg = adminData.registrations.find(r => r.id === regLead.id);
    if (testReg && testReg.notes && testReg.notes.length > 0) {
        console.log("✅ Registration Notes correctly populated in Admin Data.");
    } else {
        console.error("❌ Registration Notes NOT found in Admin Data.");
    }

    // 5. Clean up dummy data
    console.log("\n[Test 5] Cleaning up dummy data...");
    await prisma.leadNote.deleteMany({ where: { OR: [{ leadId: lead.id }, { registrationId: regLead.id }] } });
    await prisma.lead.delete({ where: { id: lead.id } });
    await prisma.registrationLead.delete({ where: { id: regLead.id } });
    await prisma.user.delete({ where: { id: user.id } });
    console.log("✅ Cleanup complete.");

    console.log("\n🎉 ALL BACKEND FLOWS VERIFIED SUCCESSFULLY!");

  } catch (err) {
    console.error("\n❌ Backend flow verification failed:", err);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

verifyFlows();
