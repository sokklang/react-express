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
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border border-primary">
          <div className="modal-header border-bottom border-primary">
            <h5 className="modal-title text-white">
              <i className="fa fa-edit fa-fw me-2"></i>Update Task
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleUpdateTask}>
            <div className="modal-body text-white text-start">
              <div className="mb-3">
                <label htmlFor="formTaskDeadline" className="form-label">
                  Task Deadline
                </label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="Enter Task Deadline"
                  value={updateTaskData.TaskDeadline}
                  required
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
                <div className="mb-3">
                  <label htmlFor="formTaskDescription" className="form-label">
                    Task Description
                  </label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Task Description (around 200 words)"
                    //style={{ height: "200px" }} // Set height to make it bigger
                    rows={5}
                    required
                    value={updateTaskData.TaskDescription}
                    onChange={(e) =>
                      setUpdateTaskData({
                        ...updateTaskData,
                        TaskDescription: e.target.value,
                      })
                    }
                  />
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
            </div>
            <div className="modal-footer border-top border-primary">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Updatetask;
