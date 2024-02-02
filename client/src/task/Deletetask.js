//Deleteusermodal.js

import { useState } from "react";

const Deletetask = ({
  showModal,
  handleClose,
  deleteTask,
  selectDeleteTask,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const handleDelete = async () => {
    try {
      // Call handleDelete and wait for it to complete
      await deleteTask(selectDeleteTask);
      // If successful, close the modal
      handleClose();
    } catch (error) {
      console.error("Delete operation failed:", error);
      setErrorMessage(error.response.data.error);
    }
  };

  const onClose = () => {
    handleClose();
    setErrorMessage("");
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa fa-exclamation-triangle fa-fw me-2"></i>Warning!
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>Confirm Delete TaskID : {selectDeleteTask}</p>

            {errorMessage ? (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
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
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deletetask;
