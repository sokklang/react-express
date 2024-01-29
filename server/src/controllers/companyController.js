const db = require("../models/database");

async function updateCompanyLogo(req, res) {
  try {
    console.log(`Received ${req.method} request for ${req.url}`);
    const requestingUserRole = req.session.user.RoleType;
    const CompanyID = req.session.user.CompanyID;

    if (requestingUserRole === "Admin User") {
      // Access the binary data from the request body
      const LogoData = req.body;
      console.log("Received Logo data:", LogoData);

      // Convert the ArrayBuffer to a Buffer
      const buffer = Buffer.from(LogoData);
      console.log("buffer", buffer);

      // Your database logic here
      db.run(
        "INSERT OR REPLACE INTO CompanyLogo (CompanyID, LogoData) VALUES (?, ?)",
        [CompanyID, buffer]
      );

      res.status(200).json({ message: "Company Logo updated successfully" });
    }
  } catch (error) {
    console.error("Error in GetCompanyLogo:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getCompanyLogo(req, res) {
  try {
    console.log(`Received ${req.method} request for ${req.url}`);

    const CompanyID = req.session.user.CompanyID;

    const CompanyLogoData = await new Promise((resolve, reject) => {
      db.get(
        "SELECT LogoData FROM CompanyLogo WHERE CompanyID = ?",
        [CompanyID],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (!CompanyLogoData) {
      return res.status(404).json({ error: "User profile image not found" });
    }

    // Send the image data for admin users
    res.status(200).send(CompanyLogoData.LogoData);
  } catch (error) {
    console.error("Error in CompanyLogoData:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateCompanyInfo(req, res) {
  try {
    console.log(`Received ${req.method} request for ${req.url}`);

    const requestingUserRole = req.session.user.RoleType;
    const CompanyID = req.session.user.CompanyID;
    const { companyAddress, companyIndustry } = req.body;

    if (!companyAddress.trim() && !companyIndustry.trim()) {
      return res.status(400).json({ error: "Input cannot be empty" });
    }
    if (requestingUserRole === "Admin User") {
      db.run("UPDATE Company SET Address=?, Industry=? WHERE CompanyID=?", [
        companyAddress,
        companyIndustry,
        CompanyID,
      ]);
      req.session.user.Address = companyAddress;
      req.session.user.Industry = companyIndustry;

      res.status(200).json({ message: "Company Info updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  updateCompanyLogo,
  getCompanyLogo,
  updateCompanyInfo,
  // ... (other company-related functions)
};
