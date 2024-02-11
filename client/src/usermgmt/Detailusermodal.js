import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";

import defaultProfileImage from "../profile/profile.jpg";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Detailusermodal = ({ showModal, handleClose, selectDetailUser }) => {
  const [profileImage, setProfileImage] = useState(null);

  console.log("selectDetailUser:", selectDetailUser);

  const fetchUserProfile = async (userid) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/getuserprofileadmin/${userid}`, // Update the URL based on your backend route
        { withCredentials: true, responseType: "arraybuffer" } // Set the responseType to 'arraybuffer' to receive the data as an ArrayBuffer
      );

      if (response.status === 200) {
        // Access the binary data from the response
        const imageData = response.data;
        console.log("imagedata", imageData);

        // Convert the ArrayBuffer to a Blob
        const blob = new Blob([imageData], { type: "image/jpeg" }); // Replace 'image/jpeg' with the actual MIME type of your images

        // Create a Blob URL from the Blob
        const blobUrl = URL.createObjectURL(blob);

        setProfileImage(blobUrl);
        console.log("Fetched user profile image data:", blobUrl);

        // Update your UI or perform other actions with the fetched data
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  useEffect(() => {
    //console.log("showModal:", showModal);
    //console.log("selectDetailUser:", selectDetailUser);

    if (showModal && selectDetailUser) {
      fetchUserProfile(selectDetailUser.UserID);
    }
  }, [showModal, selectDetailUser]);

  const onClose = async () => {
    setProfileImage("");
    handleClose();
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog text-white text-center" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa fa-info fa-fw"></i>User Details :{" "}
              {selectDetailUser.Username}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="position-relative">
              <label
                htmlFor="profileImageInput"
                className="profile-image-label"
              >
                <img
                  src={profileImage || defaultProfileImage}
                  alt="Profile"
                  className="img-fluid rounded-circle profile-image"
                  style={{
                    width: "200px",
                    height: "200px",
                    border: "2px solid #000",
                  }}
                />
              </label>
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label>User ID:</label>
                <p>{selectDetailUser.UserID}</p>
              </div>
              <div className="col-md-6">
                <label>Username:</label>
                <p>{selectDetailUser.Username}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>First Name:</label>
                <p>{selectDetailUser.FirstName}</p>
              </div>
              <div className="col-md-6">
                <label>Last Name:</label>
                <p>{selectDetailUser.LastName}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Email:</label>
                <p>{selectDetailUser.Email}</p>
              </div>
              <div className="col-md-6">
                <label>User Role:</label>
                <p>{selectDetailUser.RoleType}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Company:</label>
                <p>{selectDetailUser.CompanyName}</p>
              </div>
              <div className="col-md-6">
                <label>User Parent ID:</label>
                <p>{selectDetailUser.ParentUserID}</p>
              </div>
              <div className="col-md-6">
                <label>User Status: </label>
                <p>{selectDetailUser.IsActive === 1 ? "Active" : "Inactive"}</p>
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailusermodal;
