import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Assignuser from "./Assignuser";
import Detailtask from "../task/Detailtask";

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";

const Assigntask = () => {
  const { loggedIn } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectAssignTask, setSelectAssignTask] = useState("");
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  const [selectDetailTask, setSelectDetailTask] = useState("");
  const [showDetailTaskModal, setShowDetailTaskModal] = useState(false);

  const fetchApproveTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getapprovetask",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Tasks Fetched Successfully", response.data.approvedTasks);
        setTasks(response.data.approvedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data.error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchApproveTasks();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div className="container-fluid mt-5 p-3 border" data-bs-theme="dark">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <center>
            <h1>Assigning Task</h1>
          </center>
        </div>
        <div className="d-flex align-items-center"></div>
      </div>

      <div className="row">
        {tasks.map((task) => (
          <div key={task.TaskID} className="col-md-4 mb-4">
            <div
              className={`card bg-dark shadow-sm ${
                task.PriorityID === 1
                  ? "border-success"
                  : task.PriorityID === 2
                  ? "border-warning"
                  : "border-danger"
              }`}
            >
              <div
                className={`card-header d-flex justify-content-between align-items-center ${
                  task.PriorityID === 1
                    ? "border-success"
                    : task.PriorityID === 2
                    ? "border-warning"
                    : "border-danger"
                }`}
              >
                <h5>
                  {" "}
                  <i className="fa fa-tasks fa-fw me-2"></i>
                  {task.TaskTitle}
                </h5>
                <button
                  className="btn btn-outline-info"
                  onClick={() => {
                    setShowDetailTaskModal(true);
                    setSelectDetailTask(task);
                  }}
                >
                  <i className="fa fa-eye fa-fw" aria-hidden="true"></i> Detail
                </button>
              </div>
              <div className="card-body">
                <p className="card-text">
                  <strong>Deadline:</strong> {task.TaskDeadline}
                  <br />
                  <strong>Priority:</strong>{" "}
                  {task.PriorityID === 1 ? (
                    <span className="text-success">
                      <i className="fa fa-arrow-down fa-fw me-1"></i>Low
                    </span>
                  ) : task.PriorityID === 2 ? (
                    <span className="text-warning">
                      <i className="fa fa-arrow-right fa-fw me-1"></i>Medium
                    </span>
                  ) : (
                    <span className="text-danger">
                      <i className="fa fa-arrow-up fa-fw me-1"></i>High
                    </span>
                  )}
                  <br />
                  <strong>Type:</strong>{" "}
                  {task.TaskTypeID === 1 ? (
                    <span className="text-success">
                      <i className="fa fa-check fa-fw me-1"></i>Small Task
                    </span>
                  ) : task.TaskTypeID === 2 ? (
                    <span className="text-warning">
                      <i className="fa fa-list fa-fw me-1"></i>Medium Task
                    </span>
                  ) : task.TaskTypeID === 3 ? (
                    <span className="text-danger">
                      <i className="fa fa-list-alt fa-fw me-1"></i>Large Task
                    </span>
                  ) : (
                    <span className="text-muted">
                      <i className="fa fa-question fa-fw me-1"></i>Unknown
                    </span>
                  )}
                  <br />
                  <strong>Status:</strong> {task.Status}
                </p>
              </div>
              <div
                className={`card-footer d-flex justify-content-end ${
                  task.PriorityID === 1
                    ? "border-success"
                    : task.PriorityID === 2
                    ? "border-warning"
                    : "border-danger"
                }`}
              >
                <button
                  className="btn btn-outline-primary"
                  onClick={() => {
                    setShowAssignUserModal(true);
                    setSelectAssignTask(task.TaskID);
                  }}
                >
                  <i className="fa fa-user-plus fa-fw" aria-hidden="true"></i>{" "}
                  Assign
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Assignuser
        showModal={showAssignUserModal}
        selectAssignTask={selectAssignTask}
        handleClose={() => {
          setShowAssignUserModal(false);
        }}
      />
      <Detailtask
        showModal={showDetailTaskModal}
        selectDetailTask={selectDetailTask}
        handleClose={() => {
          setShowDetailTaskModal(false);
          setSelectDetailTask("");
        }}
      />
    </div>
  );
};

export default Assigntask;
