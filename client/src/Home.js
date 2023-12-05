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
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/home">
            Home
          </Link>
          <div className="ml-auto">
            <ul className="navbar-nav">
              <li className="nav-item">
                <p className="navbar-text mr-3">Welcome, {username}!</p>
              </li>
              <li className="nav-item">
                <button className="btn btn-danger" onClick={onLogout}>
                  Logout
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
