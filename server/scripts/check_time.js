import "dotenv/config";
process.env.TZ = "Asia/Kolkata";
console.log("Current Time (Node):", new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }));
console.log("Current Time (ISO):", new Date().toISOString());
console.log("Current Time (Raw):", new Date().toString());
