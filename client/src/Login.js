import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Login = ({ onLogin, onLogout }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
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

      const { username: loggedInUsername, companyName, token } = response.data;

      // Save the token to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("companyName", companyName);

      onLogin(loggedInUsername, companyName);
    } catch (error) {
      console.error("Login failed:", error.response.data.message);
      setErrorMessage("Invalid username or password");
    }
  };

  const checkLoginStatus = useCallback(async () => {
    console.log("Running checkLoginStatus");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/check-login",
        { withCredentials: true }
      );
      const { loggedIn, user } = response.data;

      if (loggedIn) {
        onLogin(user.username);
      } else {
        onLogout();
      }
    } catch (error) {
      console.error(
        "Error checking login status:",
        error.response.data.message
      );
    }
  }, [onLogin, onLogout]);

  useEffect(() => {
    checkLoginStatus();
  }, [checkLoginStatus]);

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
                    onClick={handleLogin}
                  >
                    Login
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
