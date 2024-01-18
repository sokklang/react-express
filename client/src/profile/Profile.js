import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect } from "react";
import axios from "axios";
import Updateprofile from "./Updateprofile";
import Updateinfo from "./Updateinfo";
import defaultProfileImage from "./profile.jpg";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Profile = () => {
  const {
    username,
    firstname,
    lastname,
    loggedIn,
    email,
    userroletype,
    companyName,
    UserRoleId,
  } = useContext(AuthContext);

  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const [showUpdateInfoModal, setShowUpdateInfoModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getuserprofile", // Update the URL based on your backend route
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

  const updateUserProfile = async (imageData) => {
    try {
      console.log("imageData", imageData);
      const response = await axios.put(
        "http://localhost:5000/api/updateuserprofile", // Update the URL based on your backend route
        imageData, // Pass the Blob directly as the request body

        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/octet-stream", // Set the content type to indicate a binary stream
          },
        }
      );

      if (response.status === 200) {
        fetchUserProfile();
        console.log("User profile image updated successfully");
        // Perform any additional actions or UI updates as needed
      }
    } catch (error) {
      console.error("Error updating user profile image:", error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchUserProfile();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-auto">
        <h2>Profile Page</h2>
        <div className="dropdown" data-bs-theme="dark">
          <button
            className="btn btn-primary dropdown-toggle"
            type="button"
            id="dropdownMenuButton1"
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
                  setShowUpdateProfileModal(true);
                }}
              >
                Update Profile
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => {
                  setShowUpdateInfoModal(true);
                }}
              >
                Update Info
              </button>
            </li>
          </ul>
        </div>

        <Updateprofile
          showModal={showUpdateProfileModal}
          profileImage={profileImage}
          updateUserProfile={updateUserProfile}
          handleClose={() => {
            setShowUpdateProfileModal(false);
          }}
        />
      </div>

      <Updateinfo
        showModal={showUpdateInfoModal}
        handleClose={() => {
          setShowUpdateInfoModal(false);
        }}
      />
      <div className="card position-relative">
        <div className="card-body">
          <div className="text-center position-relative">
            {/* Display Profile Image */}
            <img
              src={profileImage || defaultProfileImage}
              alt="Profile"
              className="img-fluid rounded-circle"
              style={{
                width: "200px",
                height: "200px",
                border: "2px solid #000",
              }}
            />
          </div>
          <h2 className="text-center mb-0">{username}</h2>
          <p className="lead text-center mb-0">
            {firstname} {lastname}
          </p>
          <p className="text-muted text-center">{userroletype}</p>
        </div>
        <ul className="list-group list-group-flush">
          <li className="list-group-item">
            <i className="fa fa-envelope me-2"></i>Email : {email}
          </li>
          <li className="list-group-item">
            <i className="fa fa-building me-2"></i>Company : {companyName}
          </li>
          <li className="list-group-item">
            <i className="fa fa-id-badge me-2 "></i>User Role :{" "}
            {UserRoleId === 2 ? "Admin" : "User"}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
