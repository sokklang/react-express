// EdituserModal.js
import React, { useState, useEffect } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Editusermodal = ({
  showModal,
  errorMessage,
  successMessage,
  handleClose,
  handleUpdate,
  selectEditUser,
}) => {
  const [updatedUserData, setUpdatedUserData] = useState({
    FirstName: selectEditUser?.FirstName || "",
    LastName: selectEditUser?.LastName || "",
    RoleType: selectEditUser?.RoleType || "",
    Email: selectEditUser?.Email || "",
    IsActive: selectEditUser?.IsActive || "",
  });

  const [roleOptions] = useState(["Admin User", "Standard User"]);
  const [userStatus] = useState(["Active", "Inactive"]);

  useEffect(() => {
    if (selectEditUser) {
      setUpdatedUserData({
        FirstName: selectEditUser.FirstName || "",
        LastName: selectEditUser.LastName || "",
        RoleType: selectEditUser.RoleType || "",
        Email: selectEditUser.Email || "",
        IsActive: selectEditUser.IsActive || "",
      });
    }
  }, [selectEditUser]);

  const handleEdit = async (e) => {
    e.preventDefault();
    console.log(updatedUserData);
    // Call the handleUpdateUser function with the updatedUserData
    handleUpdate(updatedUserData);
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog ">
        <div className="modal-content border border-primary">
          <div className="modal-header border-bottom border-primary">
            <h5 className="modal-title text-white">
              <i className="fa fa-edit fa-fw me-2"></i>Update User
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <form onSubmit={handleEdit}>
            <div className="modal-body text-white text-start">
              <div className="mb-3">
                <label htmlFor="formEditFirstName" className="form-label">
                  First Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Firstname"
                  required
                  value={updatedUserData.FirstName}
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      FirstName: e.target.value.replace(/\s/g, ""),
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formEditLastName" className="form-label">
                  Last Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Lastname"
                  value={updatedUserData.LastName}
                  required
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      LastName: e.target.value.replace(/\s/g, ""),
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formEditEmail" className="form-label">
                  Email
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-envelope fa-fw"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Email"
                    value={updatedUserData.Email}
                    required
                    onChange={(e) =>
                      setUpdatedUserData({
                        ...updatedUserData,
                        Email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="formEditRoleType" className="form-label">
                  RoleType
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="fa fa-id-badge fa-fw"></i>
                  </span>
                  <select
                    className="form-select"
                    value={updatedUserData.RoleType}
                    onChange={(e) =>
                      setUpdatedUserData({
                        ...updatedUserData,
                        RoleType: e.target.value,
                      })
                    }
                  >
                    {roleOptions.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="formEditUserStatus" className="form-label">
                  User Status
                </label>
                <select
                  className="form-select"
                  value={updatedUserData.IsActive === 1 ? "Active" : "Inactive"}
                  onChange={(e) =>
                    setUpdatedUserData({
                      ...updatedUserData,
                      IsActive: e.target.value === "Active" ? 1 : 0,
                    })
                  }
                >
                  {userStatus.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
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
            </div>
            <div className="modal-footer border-top border-primary">
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
                //onClick={handleEdit}
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Editusermodal;
