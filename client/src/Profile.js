import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

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

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }
  return (
    <div className="container mt-5">
      <h2>Profile Page</h2>
      <div className="card">
        <div className="card-body">
          <div className="text-center mb-4">
            <i className="fa fa-user fa-4x text-primary"></i>
          </div>
          <p className="lead text-center mb-0">
            {username} {firstname} {lastname}
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
