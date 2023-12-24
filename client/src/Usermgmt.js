// Usermgmt.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "font-awesome/css/font-awesome.min.css";

const Usermgmt = ( handleEdit, handleDetail) => {
  const { loggedIn, companyName, companyAddress, companyindustry } =
    useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
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

  const handleCreateUser = async () => {
    if (!username || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        firstname,
        lastname,
        password,
        companyname: companyName,
        companyaddress: companyAddress,
        industry: companyindustry,
        email,
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
    console.log(userIdToDelete)
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deleteuser/${userIdToDelete}`,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
        // Trigger useEffect by calling fetchUserData
        fetchUserData();
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
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

  const filteredUsers = users.filter((user) =>
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
            data-bs-toggle="modal"
            data-bs-target="#userModal"
          >
            <i className="fa fa-plus me-2" aria-hidden="true"></i> Add User
          </button>
          <div
            className="modal fade"
            id="userModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="userModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="userModalLabel">
                    Add User
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <i className="fa fa-window-close" aria-hidden="true"></i>
                  </button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="form-group">
                      <label htmlFor="username">Username</label>
                      <input
                        type="text"
                        placeholder="Enter Username"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="firstname">First Name</label>
                      <input
                        type="text"
                        placeholder="Enter Firstname"
                        className="form-control"
                        id="firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastname">Last Name</label>
                      <input
                        type="text"
                        placeholder="Enter Lastname"
                        className="form-control"
                        id="lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        placeholder="Enter Password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        placeholder="Enter Email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {successMessage && (
                      <div className="alert alert-success" role="alert">
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    )}
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleCreateUser()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border p-3">
        <table className="table table-dark table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Username</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Company</th>
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
                <td>{user.FirstName}</td>
                <td>{user.LastName}</td>
                <td>{user.Email}</td>
                <td>{user.CompanyName}</td>
                <td>{user.RoleType}</td>
                <td className="text-center">
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleDetail(user.UserID)}
                  >
                    <i className="fa fa-eye" aria-hidden="true"></i> Detail
                  </button>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(user.UserID)}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i> Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(user.UserID)}
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
      {/* Add additional features or components related to user management */}
    </div>
  );
};

export default Usermgmt;
