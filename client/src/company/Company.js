import React, { useContext, useEffect, useState } from "react";
import { CompanyContext } from "../context/CompanyContext";
import { AuthContext } from "../context/AuthContext";
import defaultCompanyLogo from "./defaultlogo.png";
import { Navigate } from "react-router-dom";
const Company = () => {
  const { getCompanyLogo, companyLogo, updateCompanyLogo } =
    useContext(CompanyContext);
  const { loggedIn } = useContext(AuthContext);

  const [companyLogoPreview, setCompanyLogoPreview] = useState(companyLogo);
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    if (loggedIn) {
      getCompanyLogo();
    }
  }, [loggedIn]);

  useEffect(() => {
    setCompanyLogoPreview(companyLogo);
  }, [companyLogo]);

  function handleChange(e) {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setCompanyLogoPreview(URL.createObjectURL(file));
    }
  }

  const handleUpdateImage = async () => {
    try {
      if (selectedFile) {
        const reader = new FileReader();
        reader.onload = async function () {
          const arrayBuffer = this.result;
          await updateCompanyLogo(arrayBuffer);
        };
        reader.readAsArrayBuffer(selectedFile);
      } else {
        console.error("No file selected");
      }
    } catch (error) {
      console.error("Error handling update image:", error);
    }
  };

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div className="card position-relative mt-4">
      <div className="card-body">
        <div className="text-center position-relative">
          <label htmlFor="companyLogoInput" className="company-logo-label">
            <img
              src={companyLogoPreview || defaultCompanyLogo}
              alt="Company Logo"
              className="img-fluid rounded-circle company-logo mb-3"
              style={{
                width: "200px",
                height: "200px",
                border: "2px solid #000",
              }}
            />

            <div className="overlay">
              <i className="fa fa-upload fa-fw me-2"></i>Upload
              <input
                type="file"
                id="companyLogoInput"
                className="visually-hidden"
                onChange={handleChange}
              />
            </div>
          </label>
        </div>
        <div className="text-center mt-5">
          <button
            onClick={handleUpdateImage}
            className="btn btn-primary"
            disabled={!selectedFile}
          >
            Update Logo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Company;
