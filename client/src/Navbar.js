import React from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Navbar = () => {
  const { loggedIn, UserRoleId, username, handleLogout } =
    useContext(AuthContext);
  if (!loggedIn) {
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
          <div className="collapse navbar-collapse " id="collapsibleNavbar">
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
            </ul>
            <ul className="navbar-nav ms-auto">
              <li className="nav-item dropdown">
                <button
                  className="nav-link btn btn-secondary dropdown-toggle"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  style={{ marginRight: "10px" }}
                >
                  {username}
                </button>
                <div
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="dropdownMenuButton"
                >
                  <Link className="dropdown-item" to="/profile">
                    Profile
                  </Link>
                  <Link className="dropdown-item" to="/settings">
                    Settings
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button
                    className="dropdown-item btn btn-danger"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
