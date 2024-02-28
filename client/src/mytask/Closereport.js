import React from "react";
import { useState } from "react";
import axios from "axios";

const Closereport = ({ showModal, handleClose, TaskID, FetchMyTasks }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCloseReport = async (taskId) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/closetaskreport/${taskId}`,
        null,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        FetchMyTasks();
        console.log("Tasks Closed Sucessfully", response.data);
        setErrorMessage("");
        setSuccessMessage(response.data.message);
      }
    } catch (error) {
      console.log(error.response.data.error);
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
    }
  };

  const handleSubmitCloseReport = () => {
    handleCloseReport(TaskID);
  };

  const onClose = () => {
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
      <div className="modal-dialog text-white text-center" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title " style={{ color: "red" }}>
              <i className="fa fa-exclamation-triangle fa-fw me-2"></i>Warning!
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body" style={{ color: "red" }}>
            <p>Confirm Close Report TaskID : {TaskID}</p>
            <p>After CloseReport User Can NO Longer Edit Task</p>

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
              onClick={handleSubmitCloseReport}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Closereport;
