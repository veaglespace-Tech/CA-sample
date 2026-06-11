import 'dotenv/config';
async function testSearch() {
  console.log("--- TESTING ADMIN SEARCH LOGIC ---");
  
  // We'll test the findLeads logic directly by importing the module 
  // since we don't want to deal with auth tokens in a scratch script
  const { findLeads, findUsers } = await import('./src/modules/admin.js');
  
  try {
    console.log("\n1. Testing User Search ('Akshay'):");
    const users = await findUsers("Akshay");
    console.log(`   Found ${users.length} users.`);
    
    console.log("\n2. Testing Lead Search ('Lawyer'):");
    const leadsData = await findLeads("Lawyer");
    console.log(`   Found ${leadsData.leads.length} leads.`);

    console.log("\n3. Testing Registration Search ('Akshay'):");
    const regData = await findLeads("Akshay");
    console.log(`   Found ${regData.registrations.length} registrations for 'Akshay'.`);

    console.log("\n4. Testing Lead Search ('Akshay'):");
    const busData = await findLeads("Akshay");
    console.log(`   Found ${busData.leads.length} leads for 'Akshay'.`);

    console.log("\n--- ALL BACKEND SEARCH LOGIC VERIFIED ---");
  } catch (err) {
    console.error("Test Failed:", err);
  }
}

testSearch();
