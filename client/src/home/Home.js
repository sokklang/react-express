// Home.js
import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const Home = () => {
  const {
    username,
    firstname,
    lastname,
    email,
    loggedIn,
    userid,
    userroletype,
    companyName,
    companyAddress,
    companyindustry,
    UserRoleId,
  } = useContext(AuthContext);

  const [imageLogo, setImageLogo] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

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

  useEffect(() => {
    if (loggedIn) {
      fetchUserProfile();
      getCompanyLogo();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div className="bg-light" data-bs-theme="dark">
      {/* Main Content */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-header bg-primary text-white">
                <h2>Welcome, {username}!</h2>
              </div>
              <div className="card-body ">
                <div className="row">
                  <div className="col-md-6">
                    <h5>User Information:</h5>
                    {/* Render User Profile Image */}
                    {profileImage && (
                      <div className="mb-3">
                        <img
                          src={profileImage}
                          alt="User Profile"
                          className="img-fluid rounded-circle"
                          style={{ width: "150px", height: "150px" }}
                        />
                      </div>
                    )}
                    <p>
                      <strong>Username:</strong> {username} <br />
                      <strong>Name:</strong> {firstname} {lastname} <br />
                      <strong>Email:</strong> {email} <br />
                      <strong>User ID:</strong> {userid} <br />
                      <strong>Role Type:</strong> {userroletype} <br />
                    </p>
                  </div>
                  <div className="col-md-6">
                    <h5>Company Information:</h5>
                    {/* Render Company Logo */}
                    {imageLogo && (
                      <div className="mb-3">
                        <img
                          src={imageLogo}
                          alt="Company Logo"
                          className="img-fluid rounded-circle"
                          style={{ maxHeight: "150px" }}
                        />
                      </div>
                    )}
                    <p>
                      <strong>Company Name:</strong> {companyName} <br />
                      <strong>Company Address:</strong> {companyAddress} <br />
                      <strong>Industry:</strong> {companyindustry} <br />
                      <strong>User Role ID:</strong> {UserRoleId} <br />
                    </p>
                  </div>
                </div>

                {/* You can add more content to your home page here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
