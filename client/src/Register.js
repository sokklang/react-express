// Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault(); // Prevents the default form submission

    if (!username || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
      });

      setSuccessMessage(response.data.message);
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Register</div>
            <div className="card-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-primary">
                    Register
                  </button>
                  <Link to="/login" className="btn btn-link">
                    Back to Login
                  </Link>
                </div>
              </form>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
