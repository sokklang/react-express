// Usermgmt.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

import { useContext } from "react";
import { Navigate } from "react-router-dom";

import UserModal from "./Addusermodal";
import DeleteModal from "./Deleteusermodal";
import Detailusermodal from "./Detailusermodal";
import Editusermodal from "./Editusermodal";
import Resetpasswordmodal from "./Resetpasswordmodal";

import defaultCompanyLogo from "../company/defaultlogo.png";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Usermgmt = () => {
  const { loggedIn, companyName, companyAddress, companyindustry } =
    useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showDetailUserModal, setShowDetailUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showResetPasswordmodal, setShowResetPasswordModal] = useState(false);
  const [selectDeleteId, setSelectDeleteId] = useState("");
  const [selectDeleteUsername, setSelectDeleteUsername] = useState("");
  const [selectDetailUser, setSelectDetailUser] = useState("");
  const [selectEditUser, setSelectEditUser] = useState(null);
  const [selectResetPasswordUser, setSelectResetPasswordUser] = useState("");
  const [imageLogo, setImageLogo] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getuserdata",
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUsers(response.data);
        console.log("Fetched user data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleCreateUser = async (userData) => {
    if (!userData.username || !userData.email || !userData.password) {
      // Add validation for other fields if needed
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username: userData.username,
        firstname: userData.firstname,
        lastname: userData.lastname,
        password: userData.password,
        companyname: companyName,
        companyaddress: companyAddress,
        industry: companyindustry,
        email: userData.email,
      });

      setSuccessMessage(response.data.message);
      setErrorMessage(""); // Clear any previous error message
      // Trigger useEffect by calling fetchUserData
      fetchUserData();
    } catch (error) {
      setSuccessMessage("");

      setErrorMessage(error.response.data.error);
    }
  };

  const handleDelete = async (userIdToDelete) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteuser/${userIdToDelete}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        // Trigger useEffect by calling fetchUserData
        fetchUserData();
      }
    } catch (error) {
      console.error(error.response.data.error);
      setErrorMessage(error.response.data.error);
      throw error;
    }
  };

  const handleUpdate = async (updatedUserData) => {
    const userIdToUpdate = selectEditUser.UserID;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/updateuserdata/${userIdToUpdate}`,
        updatedUserData,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        fetchUserData();
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.message);
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
      fetchUserData();
      getCompanyLogo();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  const filteredUsers = users.filter(
    (user) =>
      user &&
      user.Username &&
      user.Username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid mt-5 p-3 border" data-bs-theme="dark">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <center>
            <h1>
              <img
                alt=""
                src={imageLogo || defaultCompanyLogo}
                className="img-fluid rounded-circle company-logo mb-2"
                style={{
                  width: "50px",
                  height: "50px",
                  border: "2px solid #000",
                  marginRight: "10px",
                }}
              />
              {companyName}
            </h1>
          </center>
        </div>
        <div className="d-flex align-items-center">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fa fa-search fa-fw"></i>
            </span>
            <input
              type="text"
              placeholder="Search by Username"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control me-2"
            />
          </div>
          <button
            type="button"
            className="btn btn-primary text-nowrap"
            onClick={() => setShowUserModal(true)}
          >
            <i className="fa fa-plus me-2" aria-hidden="true"></i>Add
          </button>
          <UserModal
            showModal={showUserModal}
            handleClose={() => {
              setShowUserModal(false);
              setErrorMessage(""); // Clear error message
              setSuccessMessage("");
            }}
            handleCreateUser={handleCreateUser}
            successMessage={successMessage}
            errorMessage={errorMessage}
          />
        </div>
      </div>

      <div className="border p-3">
        <table className="table table-dark table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>

              <th>UserRole</th>
              <th>UserStatus</th>
              <th className="text-center">Action</th>
              {/* Add more fields as needed */}
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.UserID}>
                <td>{user.UserID}</td>
                <td>{user.Username}</td>

                <td>{user.RoleType}</td>
                <td>{user.IsActive === 1 ? "Active" : "Inactive"}</td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-info btn-sm me-2"
                    onClick={() => {
                      setShowDetailUserModal(true);
                      setSelectDetailUser(user);
                    }}
                  >
                    <i className="fa fa-eye" aria-hidden="true"></i> Detail
                  </button>

                  <button
                    className="btn btn-outline-primary btn-sm me-2"
                    onClick={() => {
                      setShowEditUserModal(true);
                      setSelectEditUser(user);
                    }}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i> Update
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm me-2"
                    onClick={() => {
                      setShowResetPasswordModal(true);
                      setSelectResetPasswordUser(user.UserID);
                    }}
                  >
                    <i className="fa fa-key" aria-hidden="true"></i> Reset
                  </button>

                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      setShowDeleteUserModal(true);
                      setSelectDeleteId(user.UserID);
                      setSelectDeleteUsername(user.Username);
                    }}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i> Delete
                  </button>
                </td>
                {/* Add more fields as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Detailusermodal
        showModal={showDetailUserModal}
        selectDetailUser={selectDetailUser}
        handleClose={() => {
          setShowDetailUserModal(false);
          setSelectDetailUser("");
        }}
      />
      <Editusermodal
        showModal={showEditUserModal}
        selectEditUser={selectEditUser}
        handleUpdate={handleUpdate}
        handleClose={() => {
          setShowEditUserModal(false);
          setSelectEditUser("");
          setErrorMessage(""); // Clear error message
          setSuccessMessage("");
        }}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      <Resetpasswordmodal
        showModal={showResetPasswordmodal}
        selectResetPasswordUser={selectResetPasswordUser}
        handleClose={() => {
          setShowResetPasswordModal(false);
          setSelectResetPasswordUser("");
        }}
      />
      <DeleteModal
        showModal={showDeleteUserModal}
        handleClose={() => {
          setShowDeleteUserModal(false);
          setSelectDeleteId("");
          setSelectDeleteUsername("");
          setErrorMessage("");
        }}
        handleDelete={handleDelete}
        selectDeleteId={selectDeleteId}
        selectDeleteUsername={selectDeleteUsername}
        errorMessage={errorMessage}
      />
      {/* Add additional features or components related to user management */}
    </div>
  );
};

export default Usermgmt;
