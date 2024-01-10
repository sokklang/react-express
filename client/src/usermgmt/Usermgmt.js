// Usermgmt.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";
import UserModal from "./Addusermodal";
import DeleteModal from "./Deleteusermodal";
import Detailusermodal from "./Detailusermodal";
import Editusermodal from "./Editusermodal";

const Usermgmt = () => {
  const { loggedIn, companyName, companyAddress, companyindustry } =
    useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showDetailUserModal, setShowDetailUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [selectDeleteId, setSelectDeleteId] = useState("");
  const [selectDeleteUsername, setSelectDeleteUsername] = useState("");
  const [selectDetailUser, setSelectDetailUser] = useState("");
  const [selectEditUser, setSelectEditUser] = useState(null);
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
      setErrorMessage(error.response.data.message);
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

  useEffect(() => {
    if (loggedIn) {
      fetchUserData();
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
    <div className="container-fluid mt-5 p-3 border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <center>
            <h1>
              <i className="fa fa-building" aria-hidden="true"></i>
              {companyName}
            </h1>
          </center>
        </div>
        <div className="d-flex align-items-center">
          <input
            type="text"
            placeholder="Search by Username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-control me-2"
          />
          <button
            type="button"
            className="btn btn-primary text-nowrap"
            onClick={() => setShowUserModal(true)}
          >
            <i className="fa fa-plus me-2" aria-hidden="true"></i> Add User
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
                <td className="text-center">
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => {
                      setShowDetailUserModal(true);
                      setSelectDetailUser(user);
                    }}
                  >
                    <i className="fa fa-eye" aria-hidden="true"></i> Detail
                  </button>
                  <Detailusermodal
                    showModal={showDetailUserModal}
                    selectDetailUser={selectDetailUser}
                    handleClose={() => {
                      setShowDetailUserModal(false);
                      setSelectDetailUser("");
                    }}
                  />
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setShowEditUserModal(true);
                      setSelectEditUser(user);
                    }}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i> Edit
                  </button>
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
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setShowDeleteUserModal(true);
                      setSelectDeleteId(user.UserID);
                      setSelectDeleteUsername(user.Username);
                    }}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i> Delete
                  </button>
                  <DeleteModal
                    showModal={showDeleteUserModal}
                    handleClose={() => {
                      setShowDeleteUserModal(false);
                      setSelectDeleteId("");
                      setSelectDeleteUsername("");
                    }}
                    handleDelete={handleDelete}
                    selectDeleteId={selectDeleteId}
                    selectDeleteUsername={selectDeleteUsername}
                  />
                </td>
                {/* Add more fields as needed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add additional features or components related to user management */}
    </div>
  );
};

export default Usermgmt;
