import React from "react";
import { useState } from "react";
import axios from "axios";

const Resetpasswordmodal = ({
  showModal,
  handleClose,
  selectResetPasswordUser,
}) => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      setErrorMessage("Password doesn't Match");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:5000/api/resetpassword/${selectResetPasswordUser}`,
        { password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        setSuccessMessage(response.data.message);
        setErrorMessage("");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
    }
  };

  const onClose = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setPassword("");
    setConfirmPassword("");
    handleClose();
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
              <i className="fa fa-key fa-fw me-2"></i>Reset Password
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
            <form onSubmit={handleResetPassword}>
              <div className="mb-3">
                <label htmlFor="formNewPassword" className="form-label">
                  New Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-lock fa-fw"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="on"
                    className="form-control"
                    placeholder="Enter New Password"
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
              <div className="mb-3">
                <label htmlFor="formConfirmPassword" className="form-label">
                  Confirm Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-lock fa-fw"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="on"
                    className="form-control"
                    placeholder="Enter Confirm Password"
                    value={confirmpassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value.replace(/\s/g, ""))
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
              {/* Add more fields for editing, if necessary */}
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
                  type="submit"
                  className="btn btn-primary"
                  //onClick={handleEdit}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resetpasswordmodal;
