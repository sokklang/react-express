import React from "react";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const Updateinfo = ({ showModal, handleClose }) => {
  const { firstname, lastname, email, handleSelfUpdate } =
    useContext(AuthContext);
  const [updatedFirstname, setUpdatedFirstname] = useState(firstname);
  const [updatedLastname, setUpdatedLastname] = useState(lastname);
  const [updatedEmail, setUpdatedEmail] = useState(email);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdateInfo = async (e) => {
    e.preventDefault();

    const updateUserInfo = {
      FirstName: updatedFirstname,
      LastName: updatedLastname,
      Email: updatedEmail,
    };

    try {
      const response = await axios.put(
        "http://localhost:5000/api/selfupdatedata",
        updateUserInfo,
        { withCredentials: true }
      );

      if (response.status === 200) {
        handleSelfUpdate(updateUserInfo);
        setSuccessMessage(response.data.message);
        setErrorMessage("");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.message);
    }
  };

  const onClose = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    handleClose();
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
              <i className="fa fa-edit fa-fw me-2"></i>Update Info
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
            <form onSubmit={handleUpdateInfo}>
              <div className="mb-3">
                <label htmlFor="formEditFirstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formEditFirstName"
                  placeholder="Enter Firstname"
                  value={updatedFirstname}
                  onChange={(e) => setUpdatedFirstname(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formEditLastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formEditLastName"
                  placeholder="Enter Lastname"
                  value={updatedLastname}
                  onChange={(e) => setUpdatedLastname(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formEditEmail" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="formEditEmail"
                  placeholder="Enter Email"
                  value={updatedEmail}
                  onChange={(e) => setUpdatedEmail(e.target.value)}
                />
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

export default Updateinfo;
