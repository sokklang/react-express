import React from "react";
import { useState, useEffect } from "react";

const Updatetask = ({
  showModal,
  handleClose,
  errorMessage,
  successMessage,
  selectUpdateTask,
  updateTask,
}) => {
  const [updateTaskData, setUpdateTaskData] = useState({
    TaskDescription: selectUpdateTask?.TaskDescription || "",
    TaskDeadline: selectUpdateTask?.TaskDeadline || "",
    PriorityID: selectUpdateTask?.PriorityID || "",
    TaskTypeID: selectUpdateTask?.TaskTypeID || "",
    DependentTaskID: selectUpdateTask?.DependentTaskID || "",
  });

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    console.log(updateTaskData);
    // Call the handleUpdateUser function with the updatedUserData
    updateTask(updateTaskData);
  };

  const onClose = () => {
    handleClose();
  };

  useEffect(() => {
    if (selectUpdateTask) {
      setUpdateTaskData({
        TaskDescription: selectUpdateTask.TaskDescription || "",
        TaskDeadline: selectUpdateTask.TaskDeadline || "",
        PriorityID: selectUpdateTask.PriorityID || "",
        TaskTypeID: selectUpdateTask.TaskTypeID || "",
        DependentTaskID: selectUpdateTask.DependentTaskID || "",
      });
    }
  }, [selectUpdateTask]);

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-white">
              <i className="fa fa-task fa-fw me-2"></i>Add Task
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
            <form onSubmit={handleUpdateTask}>
              <div className="mb-3">
                <label htmlFor="formTaskDescription" className="form-label">
                  Task Description
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Task Description"
                  value={updateTaskData.TaskDescription}
                  onChange={(e) =>
                    setUpdateTaskData({
                      ...updateTaskData,
                      TaskDescription: e.target.value,
                    })
                  }
                />
              </div>
              <div className="mb-3">
                <label htmlFor="formTaskDeadline" className="form-label">
                  Task Deadline
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Enter Task Deadline"
                  value={updateTaskData.TaskDeadline}
                  onChange={(e) =>
                    setUpdateTaskData({
                      ...updateTaskData,
                      TaskDeadline: e.target.value,
                    })
                  }
                />
              </div>
              <div className="row">
                <div className="col mb-3">
                  <label htmlFor="formPriorityID" className="form-label">
                    Priority
                  </label>
                  <select
                    className="form-select"
                    value={updateTaskData.PriorityID}
                    onChange={(e) =>
                      setUpdateTaskData({
                        ...updateTaskData,
                        PriorityID: e.target.value,
                      })
                    }
                  >
                    <option value={1}>Low</option>
                    <option value={2}>Medium</option>
                    <option value={3}>High</option>
                  </select>
                </div>

                <div className="col mb-3">
                  <label htmlFor="formTaskTypeID" className="form-label">
                    Task Type
                  </label>
                  <select
                    className="form-select"
                    value={updateTaskData.TaskTypeID}
                    onChange={(e) =>
                      setUpdateTaskData({
                        ...updateTaskData,
                        TaskTypeID: e.target.value,
                      })
                    }
                  >
                    <option value={1}>Small Task</option>
                    <option value={2}>Medium Task</option>
                    <option value={3}>Large Task</option>
                  </select>
                </div>
              </div>

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
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Updatetask;
