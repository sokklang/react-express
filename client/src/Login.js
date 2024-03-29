import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "./context/AuthContext"; // Import AuthContext

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  // Use the AuthContext
  const { handleLogin, handleLogout } = useContext(AuthContext);

  const checkLoginStatus = useCallback(async () => {
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
          user.UserRoleId,
          user.CompanyID
        );
        console.log("Login status", response.data.loggedIn);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error("Login status:", error.response.data.loggedIn);
    }
  }, [handleLogin, handleLogout]);

  const handleUserLogin = async () => {
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
        companyid,
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
        userroleid,
        companyid
      );
      navigate("/home");
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

  return (
    <div className="container mt-5" data-bs-theme="dark">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header fs-4 fw-bold">
              <i className="fa fa-user-circle fa-fw me-2"></i>Login
              <div className="dragon">{/* Render the GIF */}</div>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label fs-5 fw-bold">
                    Username
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa fa-user fa-fw"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter username"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.replace(/\s/g, ""))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label fs-5 fw-bold">
                    Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa fa-lock fa-fw"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      autoComplete="on"
                      placeholder="Enter Password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value.replace(/\s/g, ""))
                      }
                      required
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <i className="fa fa-eye-slash fa-fw"></i>
                      ) : (
                        <i className="fa fa-eye fa-fw"></i>
                      )}
                    </button>
                  </div>
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
                    onClick={handleUserLogin}
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
