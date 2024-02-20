// UserModal.js
import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";
const UserModal = ({
  showModal,
  handleClose,
  handleCreateUser,
  successMessage,
  errorMessage,
}) => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    // Validate input fields if needed
    // Perform necessary checks before calling handleCreateUser
    handleCreateUser({
      username,
      firstname,
      lastname,
      password,
      email,
    });
    // Optionally, you can reset the form fields here
    //setUsername("");
    //setFirstname("");
    //setLastname("");
    //setPassword("");
    //setEmail("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-white">
              <i className="fa fa-user-plus fa-fw me-2"></i>Add User
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
            <form onSubmit={handleCreate}>
              <div className="mb-3">
                <label htmlFor="formUsername" className="form-label ">
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-user fa-fw"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    id="formUsername"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>
              </div>
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="formFirstName" className="form-label">
                    Firstname
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="formFirstName"
                    placeholder="Enter Firstname"
                    value={firstname}
                    onChange={(e) =>
                      setFirstname(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>

                <div className="col mb-3">
                  <label htmlFor="formLastName" className="form-label">
                    Lastname
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="formLastName"
                    placeholder="Enter Lastname"
                    value={lastname}
                    onChange={(e) =>
                      setLastname(e.target.value.replace(/\s/g, ""))
                    }
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="formPassword" className="form-label">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-lock fa-fw"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="on"
                    className="form-control"
                    id="formPassword"
                    placeholder="Enter Password"
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
                      <i className="fa fa-eye-slash fa-fw"></i>
                    ) : (
                      <i className="fa fa-eye fa-fw"></i>
                    )}
                  </button>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="formEmail" className="form-label">
                  Email
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-envelope fa-fw"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    id="formEmail"
                    placeholder="Enter Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {errorMessage ? (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorMessage}
                </div>
              ) : successMessage ? (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              ) : null}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  //onClick={handleCreate}
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserModal;
