// Home.js
import { Navigate, Link } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Home = ({ username, loggedIn, onLogout }) => {
  const companyName = localStorage.getItem("companyName");

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {/* Navigation Bar */}
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
              <li className="nav-item">
                <Link className="nav-link" to="/approval">
                  Approval
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/usermgmt">
                  User Mgmt
                </Link>
              </li>
              <li className="nav-item">
                <button className="nav-link" onClick={onLogout}>
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                Welcome, {username}!
              </div>
              <div className="card-body">
                <p className="card-text">
                  Hello, {username}! Welcome back to {companyName}.
                </p>
                {/* You can add the content of your home page here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
