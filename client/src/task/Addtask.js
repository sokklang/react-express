import React, { useState } from "react";
import axios from "axios";

const AddTask = ({ showModal, handleClose, fetchTasks }) => {
  const [taskData, setTaskData] = useState({
    TaskTitle: "",
    TaskDescription: "",
    TaskDeadline: "",
    PriorityID: 1,
    TaskTypeID: 1,
    DependentTaskID: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/addtask",
        taskData,
        {
          withCredentials: true, // Include credentials in the request
        }
      );

      if (response.status === 201) {
        fetchTasks();

        console.log("Task added successfully with ID:", response.data.taskId);
        setErrorMessage("");

        setSuccessMessage("Task added successfully!");
      }
    } catch (error) {
      console.error("Error adding task:", error.response.data.error);
      setErrorMessage(error.response.data.error);
      setSuccessMessage("");
      // Handle error, show a message to the user, etc.
    }
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
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border border-primary">
          <div className="modal-header border-bottom border-primary">
            <h5 className="modal-title text-white">
              <i className="fa fa-plus fa-fw me-2"></i>Add Task
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
            <form onSubmit={handleAddTask}>
              <div className="mb-3">
                <label htmlFor="formTaskTitle" className="form-label">
                  Task Title
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Task Title"
                  value={taskData.TaskTitle}
                  onChange={(e) =>
                    setTaskData({ ...taskData, TaskTitle: e.target.value })
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
                  value={taskData.TaskDeadline}
                  onChange={(e) =>
                    setTaskData({ ...taskData, TaskDeadline: e.target.value })
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
                    value={taskData.PriorityID}
                    onChange={(e) =>
                      setTaskData({ ...taskData, PriorityID: e.target.value })
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
                    value={taskData.TaskTypeID}
                    onChange={(e) =>
                      setTaskData({ ...taskData, TaskTypeID: e.target.value })
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
                    type="text"
                    className="form-control"
                    placeholder="Enter Task Description"
                    rows={5}
                    value={taskData.TaskDescription}
                    onChange={(e) =>
                      setTaskData({
                        ...taskData,
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

              <div className="modal-footer border-top border-primary">
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

export default AddTask;
