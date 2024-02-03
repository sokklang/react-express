import React from "react";

const Detailtask = ({ showModal, handleClose, selectDetailTask }) => {
  const convertTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Invalid Timestamp";
    }

    // Split date and time parts
    const [datePart, timePart] = timestamp.split(" ");

    // Split date into year, month, and day
    const [year, month, day] = datePart.split("-");

    // Split time into hours, minutes, and seconds
    const [hours, minutes, seconds] = timePart.split(":");

    // Create a new Date object
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    );

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Timestamp";
    }

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    return date.toLocaleString(undefined, options);
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
              <i className="fa fa-info fa-fw"></i>Task Title :{" "}
              {selectDetailTask.TaskTitle}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Task ID:</label>
                <p>{selectDetailTask.TaskID}</p>
              </div>
              <div className="col-md-6">
                <label>Task Description:</label>
                <p>{selectDetailTask.TaskDescription}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Task Priority:</label>
                <p>
                  {selectDetailTask.PriorityID === 1
                    ? "Low"
                    : selectDetailTask.PriorityID === 2
                    ? "Medium"
                    : "High"}
                </p>
              </div>
              <div className="col-md-6">
                <label>Task Type:</label>
                <p>
                  {selectDetailTask.TaskTypeID === 1
                    ? "Small Task"
                    : selectDetailTask.TaskTypeID === 2
                    ? "Medium Task"
                    : selectDetailTask.TaskTypeID === 3
                    ? "Large Task"
                    : "Unknown"}
                </p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Status:</label>
                <p>{selectDetailTask.Status}</p>
              </div>
              <div className="col-md-6">
                <label>ApprovalStatus:</label>
                <p>{selectDetailTask.ApprovalStatus}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>ApproverUserID:</label>
                <p>{selectDetailTask.ApproverUserID}</p>
              </div>
              <div className="col-md-6">
                <label>ApprovalTimestamp:</label>
                <p>{selectDetailTask.ApprovalTimestamp}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>TaskCreationDate: </label>
                <p>{convertTimestamp(selectDetailTask.TaskCreationDate)}</p>
              </div>
              <div className="col-md-6">
                <label>DependentTaskID: </label>
                <p>{selectDetailTask.DependentTaskID}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailtask;
