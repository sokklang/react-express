import React from "react";
import { useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Archivetask = ({ showModal, handleClose, TaskID, FetchMyTasks }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleArchiveTask = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/archivetask/${TaskID}`,
        null,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        FetchMyTasks();
        console.log(response.data.message);
        setErrorMessage("");
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.error);
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
    }
  };

  const onClose = async () => {
    handleClose();
    setErrorMessage("");
    setSuccessMessage("");
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
              <i className="fa fa-archive fa-fw me-2"></i>Archive Task
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
              className="btn btn-primary"
              onClick={handleArchiveTask}
            >
              Archive
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archivetask;
