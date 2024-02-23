import React from "react";
import { useState, useEffect } from "react";
import defaultProfileImage from "./profile.jpg";

const Updateprofile = ({
  showModal,
  handleClose,
  profileImage,
  updateUserProfile,
}) => {
  const [selectedFile, setSelectedFile] = useState();
  const [imagePreview, SetImagePreview] = useState(profileImage);

  useEffect(() => {
    SetImagePreview(profileImage);
  }, [profileImage]);

  function handleChange(e) {
    console.log(e.target.files);
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);

      // Create a Blob from the ArrayBuffer
      const blob = new Blob([file], { type: file.type });

      // Use createObjectURL with the Blob
      SetImagePreview(URL.createObjectURL(blob));
    }
  }
  const handleUpdateImage = async () => {
    try {
      if (selectedFile) {
        // Use the FileReader API to read the Blob as an ArrayBuffer
        const reader = new FileReader();
        reader.onload = async function () {
          const arrayBuffer = this.result;
          console.log(arrayBuffer);

          // Pass the ArrayBuffer to updateUserProfile
          await updateUserProfile(arrayBuffer);
        };
        reader.readAsArrayBuffer(selectedFile); // Read the File object as an ArrayBuffer
      } else {
        console.error("No file selected");
      }
    } catch (error) {
      console.error("Error handling update image:", error);
    }
  };

  const onClose = async () => {
    SetImagePreview(profileImage);
    handleClose();
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
              <i className="fa fa-user-circle fa-fw me-2"></i>Update Profile
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
                  src={imagePreview || defaultProfileImage}
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

export default Updateprofile;
