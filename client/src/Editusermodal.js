// EdituserModal.js
import React, { useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Editusermodal = ({ showModal, handleClose, handleUpdate
  , selectEditUser }) => {
  
  const [updatedUserData, setUpdatedUserData] = useState({
    FirstName: selectEditUser?.FirstName || "",
    LastName: selectEditUser?.LastName || "",
    RoleType: selectEditUser?.RoleType || "",
    Email: selectEditUser?.Email || "",
    
  });
  
  const handleEdit = () => {
    console.log(updatedUserData)
    // Call the handleUpdateUser function with the updatedUserData
    handleUpdate(updatedUserData);
    
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
              <i className="fa fa-edit fa-fw me-2"></i>Edit User
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body text-white">
            <form>
              <div className="mb-3">
                <label htmlFor="formEditFirstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formEditFirstName"
                  placeholder="Enter Firstname"
                  value={updatedUserData.FirstName}
                  onChange={(e) => setUpdatedUserData({ ...updatedUserData, FirstName: e.target.value })}
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
                  value={updatedUserData.LastName}
                  onChange={(e) => setUpdatedUserData({ ...updatedUserData, LastName: e.target.value })}
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
                  value={updatedUserData.Email}
                  onChange={(e) => setUpdatedUserData({ ...updatedUserData, Email: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formEditRoleType" className="form-label">
                  RoleType
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="formEditRoleType"
                  placeholder="Enter RoleType"
                  value={updatedUserData.RoleType}
                  onChange={(e) => setUpdatedUserData({ ...updatedUserData, RoleType: e.target.value })}
                />
              </div>
              {/* Add more fields for editing, if necessary */}
            </form>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleEdit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editusermodal;
