// Register.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [companyname, setCompanyname] = useState("");
  const [companyaddress, setCompanyaddress] = useState("");
  const [industry, setIndustry] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
        firstname,
        lastname,
        password,
        companyname,
        companyaddress,
        industry,
        email,
      });

      setSuccessMessage(response.data.message);
      setErrorMessage(""); // Clear any previous error message
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="container mt-5" data-bs-theme="dark">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header fs-5 fw-bold">
              <i className="fa fa-registered fa-fw me-1 "></i>Register
            </div>
            <div className="card-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Username
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa fa-user fa-fw"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter Username"
                      className="form-control"
                      id="username"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.replace(/\s/g, ""))
                      }
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col mb-3">
                    <label htmlFor="firstname" className="form-label">
                      Firstname
                    </label>
                    <input
                      type="text"
                      placeholder="Enter firstname"
                      className="form-control"
                      id="firstname"
                      value={firstname}
                      onChange={(e) =>
                        setFirstname(e.target.value.replace(/\s/g, ""))
                      }
                    />
                  </div>
                  <div className="col mb-3">
                    <label htmlFor="lastname" className="form-label">
                      Lastname
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Lastname"
                      className="form-control"
                      id="lastname"
                      value={lastname}
                      onChange={(e) =>
                        setLastname(e.target.value.replace(/\s/g, ""))
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
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
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? (
                        <i className="fa fa-eye-slash"></i>
                      ) : (
                        <i className="fa fa-eye"></i>
                      )}
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa fa-envelope fa-fw"></i>
                    </span>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value.replace(/\s/g, ""))
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="Company" className="form-label">
                    Company Name
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa fa fa-institution fa-fw"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter Company Name"
                      className="form-control"
                      id="company"
                      value={companyname}
                      onChange={(e) =>
                        setCompanyname(e.target.value.replace(/\s/g, ""))
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="Company Address" className="form-label">
                    Company Address
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa fa-map-pin fa-fw"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter Company Address"
                      className="form-control"
                      id="companyaddress"
                      value={companyaddress}
                      onChange={(e) => setCompanyaddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="Company Industry" className="form-label">
                    Company Industry
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fa fa-industry fa-fw"></i>
                    </span>
                    <input
                      type="text"
                      placeholder="Enter Company Industry"
                      className="form-control"
                      id="companyindustry"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    />
                  </div>
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
