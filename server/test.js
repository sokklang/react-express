const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("usersv1.db");

try {
  const companyInsertResult = await db.run(
    "INSERT INTO Company (CompanyName, Address, Industry) VALUES (?, ?, ?)",
    [companyname, companyaddress, industry]
  );
  companyId = companyInsertResult.lastID; // Get the ID of the newly inserted company
} catch (error) {
  console.error(`Error inserting into Company table: ${error.message}`);
}