import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  // Use the AuthContext
  const { handleLogin, handleLogout } = useContext(AuthContext);

  const checkLoginStatus = useCallback(async () => {
    console.log("Running checkLoginStatus");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/check-login",
        { withCredentials: true }
      );
      const { loggedIn, user } = response.data;

      if (loggedIn) {
        handleLogin(
          user.Username,
          user.FirstName,
          user.LastName,
          user.Email,
          user.UserID,
          user.RoleType,
          user.CompanyName,
          user.Address,
          user.Industry,
          user.UserRoleId
        );
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error(
        "Error checking login status:",
        error.response.data.message
      );
    }
  }, [handleLogin, handleLogout]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  const checkLogininput = async () => {
    if (!username || !password) {
      setErrorMessage("Username and password are required");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { username, password },
        { withCredentials: true }
      );

      const {
        username: loggedInUsername,
        firstname,
        lastname,
        email,
        userid,
        userroletype,
        companyname,
        companyaddress,
        companyindustry,
        userroleid,
      } = response.data;

      // Save the token to localStorage
      //localStorage.setItem("token", token);
      //localStorage.setItem("userid", userid);
      //localStorage.setItem("userroletype", userroletype);
      //localStorage.setItem("companyName", companyName);
      //localStorage.setItem("UserRoleId", UserRoleId);

      handleLogin(
        loggedInUsername,
        firstname,
        lastname,
        email,
        userid,
        userroletype,
        companyname,
        companyaddress,
        companyindustry,
        userroleid
      );
      navigate("/home");
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      setErrorMessage("Invalid username or password");
    }
  };

  return (
    <div className="container mt-5" data-bs-theme="dark">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Login</div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}
                <div className="mb-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={checkLogininput}
                  >
                    <i className="fa fa-sign-in fa-fw me-2"></i>Login
                  </button>
                  <Link to="/register" className="btn btn-link">
                    Register
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
