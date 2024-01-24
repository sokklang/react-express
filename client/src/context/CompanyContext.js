import React, { createContext, useState } from "react";
import axios from "axios";

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  //const [companyName, setCompanyName] = useState("");
  //const [companyAddress, setCompanyAddress] = useState("");
  //const [companyIndustry, setCompanyIndustry] = useState("");
  const [companyLogo, setCompanyLogo] = useState("");

  const updateCompanyLogo = async (LogoData) => {
    try {
      console.log("imageData", LogoData);
      const response = await axios.put(
        "http://localhost:5000/api/updatecompanylogo", // Update the URL based on your backend route
        LogoData, // Pass the Blob directly as the request body

        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/octet-stream", // Set the content type to indicate a binary stream
          },
        }
      );

      if (response.status === 200) {
        console.log("Company Logo updated successfully");
        getCompanyLogo();
        // Perform any additional actions or UI updates as needed
      }
    } catch (error) {
      console.error("Error updating Company Logo image:", error);
    }
  };

  const getCompanyLogo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getcompanylogo", // Update the URL based on your backend route
        { withCredentials: true, responseType: "arraybuffer" } // Set the responseType to 'arraybuffer' to receive the data as an ArrayBuffer
      );

      if (response.status === 200) {
        // Access the binary data from the response
        const LogoData = response.data;
        console.log("imagedata", LogoData);

        // Convert the ArrayBuffer to a Blob
        const blob = new Blob([LogoData], { type: "image/jpeg" }); // Replace 'image/jpeg' with the actual MIME type of your images

        // Create a Blob URL from the Blob
        const blobUrl = URL.createObjectURL(blob);

        setCompanyLogo(blobUrl);
        console.log("Fetched Company Logo data:", blobUrl);

        // Update your UI or perform other actions with the fetched data
      }
    } catch (error) {
      console.error("Error fetching Company Logo data:", error);
    }
  };

  return (
    <CompanyContext.Provider
      value={{
        //companyName,
        //companyAddress,
        //companyIndustry,
        companyLogo,
        updateCompanyLogo,
        getCompanyLogo,
        // Additional values or functions can be added here
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};
