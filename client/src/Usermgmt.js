// Usermgmt.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

import { Navigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "font-awesome/css/font-awesome.min.css";

const Usermgmt = (handleDelete, handleEdit) => {
  const { loggedIn, companyName } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
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

    if (loggedIn) {
      fetchUserData();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <center>
        <h1>{companyName}</h1>
      </center>
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
          {users.map((user) => (
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
      {/* Add additional features or components related to user management */}
    </div>
  );
};

export default Usermgmt;
