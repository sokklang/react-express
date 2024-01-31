import React from "react";
import { AuthContext } from "../context/AuthContext";
import { useState, useContext } from "react";

const Updatecompanyinfo = ({
  showModal,
  updateCompanyInfo,
  handleClose,
  errorMessage,
  successMessage,
}) => {
  const { companyName, companyAddress, companyindustry } =
    useContext(AuthContext);

  const [updateCompany, setUpdateCompany] = useState({
    companyAddress: companyAddress,
    companyIndustry: companyindustry,
  });

  const handleUpdateCompanyInfo = async (e) => {
    e.preventDefault();
    updateCompanyInfo(updateCompany);
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
              <i className="fa fa-edit fa-fw me-2"></i>Edit {companyName} Info
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
            <form onSubmit={handleUpdateCompanyInfo}>
              <div className="mb-3">
                <label htmlFor="formEditCompanyAddress" className="form-label">
                  Company Address
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Company Address"
                  value={updateCompany.companyAddress}
                  onChange={(e) =>
                    setUpdateCompany({
                      ...updateCompany,
                      companyAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formEditCompanyIndustry" className="form-label">
                  Company Industry
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Company Industry"
                  value={updateCompany.companyIndustry}
                  onChange={(e) =>
                    setUpdateCompany({
                      ...updateCompany,
                      companyIndustry: e.target.value,
                    })
                  }
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
                  onClick={handleClose}
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

export default Updatecompanyinfo;
