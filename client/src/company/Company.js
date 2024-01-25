import React, { useContext, useEffect, useState } from "react";
//import { CompanyContext } from "../context/CompanyContext";
import { AuthContext } from "../context/AuthContext";
import Updatecompanylogo from "./Updatecompanylogo";
import axios from "axios";

import defaultCompanyLogo from "./defaultlogo.png";
import { Navigate } from "react-router-dom";
const Company = () => {
  //const { UpdateLogo } = useContext(CompanyContext);
  const { loggedIn, companyName, companyAddress, companyindustry } =
    useContext(AuthContext);
  const [imageLogo, setImageLogo] = useState(null);

  const [showUpdateCompanyLogoModal, setShowUpdateCompanyLogo] =
    useState(false);
  const [showUpateCompanyInfo, setShowUpdateCompanyInfo] = useState(false);

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

        setImageLogo(blobUrl);
        console.log("Fetched Company Logo data:", blobUrl);

        // Update your UI or perform other actions with the fetched data
      }
    } catch (error) {
      console.error("Error fetching Company Logo data:", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      getCompanyLogo();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-auto">
        <h2>{companyName} Page</h2>
        <div className="dropdown" data-bs-theme="dark">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fa-edit fa-fw me-1"></i>Update
          </button>
          <ul
            className="dropdown-menu"
            aria-labelledby="dropdownUpdateMenuButton"
          >
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setShowUpdateCompanyLogo(true);
                }}
              >
                Update Logo
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setShowUpdateCompanyInfo(true);
                }}
              >
                Update Info
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Updatecompanylogo
        showModal={showUpdateCompanyLogoModal}
        imageLogo={imageLogo}
        updateCompanyLogo={updateCompanyLogo}
        handleClose={() => {
          setShowUpdateCompanyLogo(false);
        }}
      />
      <div className="card position-relative">
        <div className="card-body">
          <div className="text-center position-relative">
            {/* Display Profile Image */}
            <img
              src={imageLogo || defaultCompanyLogo}
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{
                width: "200px",
                height: "200px",
                border: "2px solid #000",
              }}
            />
          </div>
          <h2 className="text-center mb-0">{companyName}</h2>
          <p className="lead text-center mb-0">{companyAddress}</p>
          <p className="text-muted text-center">{companyindustry}</p>
        </div>
      </div>
    </div>
  );
};

export default Company;
