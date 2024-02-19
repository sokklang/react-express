import React from "react";

import { useState, useEffect } from "react";
import defaultCompanyLogo from "./defaultlogo.png";

const Updatecompanylogo = ({
  showModal,
  handleClose,
  updateCompanyLogo,
  imageLogo,
}) => {
  const [companyLogoPreview, setCompanyLogoPreview] = useState();
  const [selectedFile, setSelectedFile] = useState();

  useEffect(() => {
    setCompanyLogoPreview(imageLogo);
  }, [imageLogo]);

  const onClose = async () => {
    setCompanyLogoPreview(imageLogo);
    handleClose();
  };

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

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content text-white">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa fa-institution fa-fw me-2"></i>Update Logo
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-center">
            <div className="position-relative">
              <label
                htmlFor="profileImageInput"
                className="profile-image-label"
              >
                <img
                  src={companyLogoPreview || defaultCompanyLogo}
                  alt="Profile"
                  className="img-fluid rounded-circle profile-image mb-3"
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
                    id="profileImageInput"
                    className="visually-hidden"
                    onChange={handleChange}
                  />
                </div>
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateImage}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Updatecompanylogo;
