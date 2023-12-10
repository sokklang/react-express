import React from "react";
import { Navigate, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = ({ isLoggedIn, UserRoleId, onLogout }) => {
  if (!isLoggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }
  return (
    <div>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/home">
            Home
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapsibleNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/task">
                  Task
                </Link>
              </li>
              {String(UserRoleId) === "2" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/approval">
                    Approval
                  </Link>
                </li>
              )}
              {String(UserRoleId) === "2" && (
                <li className="nav-item">
                  <Link className="nav-link" to="/usermgmt">
                    User Mgmt
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <button className="nav-link" onClick={onLogout}>
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
