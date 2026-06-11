import axios from "axios";
import fs from "fs";
import FormData from "form-data";

async function testUpload() {
  const fd = new FormData();
  fd.append("document", fs.createReadStream("scratch/test_db_write.js"));
  fd.append("fileName", "test_from_script.js");
  fd.append("description", "Testing the API endpoint");
  fd.append("category", "TEMPLATE");

  try {
    const res = await axios.post("http://localhost:5000/api/admin/repository/upload", fd, {
      headers: {
        ...fd.getHeaders(),
        // We need an auth token if requireAuth is on
        // But since I'm running this locally, I'll temporarily disable auth in a test branch or just see if it hits the controller
      }
    });
    console.log("Response:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

testUpload();
