import React from "react";
import { useState } from "react";

const Deletereport = ({ showModal, handleClose, TaskID }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleDeleteReport = async () => {};

  const onClose = async () => {
    handleClose();
  };
  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div
        className="modal-dialog modal-xl text-white text-center"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa fa-remove fa-fw me-2"></i>Remove Report
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-start">
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
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleDeleteReport}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deletereport;
