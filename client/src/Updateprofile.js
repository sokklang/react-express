import React from "react";
import { useState } from "react";

const Updateprofile = ({
  showModal,
  handleClose,
  profileImage,

  updateUserProfile,
}) => {
  const [selectedFile, setSelectedFile] = useState();
  const [imagePreview, SetImagePreview] = useState(profileImage);
  function handleChange(e) {
    console.log(e.target.files);
    setSelectedFile(e.target.files[0]);
    SetImagePreview(URL.createObjectURL(e.target.files[0]));
  }

  const handleUpdateImage = async () => {
    try {
      if (selectedFile) {
        // Use the FileReader API to read the Blob as an ArrayBuffer
        const reader = new FileReader();
        reader.onload = async function () {
          const arrayBuffer = this.result;

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

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content text-white">
          <div className="modal-header">
            <h5 className="modal-title">Update Profile</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body text-center">
            <div className="position-relative">
              <label
                htmlFor="profileImageInput"
                className="profile-image-label"
              >
                <img
                  src={imagePreview}
                  alt="Profile"
                  className="img-fluid rounded-circle profile-image"
                  style={{ width: "200px", height: "200px" }}
                />
                <div className="overlay">
                  <i className="fa fa-upload fa-fw"></i>
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
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdateImage}
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Updateprofile;
