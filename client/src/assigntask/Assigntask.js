import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "axios";
import Assignuser from "./Assignuser";
import Detailtask from "../task/Detailtask";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Assigntask = () => {
  const { loggedIn } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [selectAssignTask, setSelectAssignTask] = useState("");
  const [showAssignUserModal, setShowAssignUserModal] = useState(false);
  const [selectDetailTask, setSelectDetailTask] = useState("");
  const [showDetailTaskModal, setShowDetailTaskModal] = useState(false);
  //const [errorMessage, setErrorMessage] = useState("");
  //const [successMessage, setSuccessMessage] = useState("");

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
    <div className="container-fluid mt-5 p-3 border">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <center>
            <h1>Assigning Task</h1>
          </center>
        </div>
        <div className="d-flex align-items-center"></div>
      </div>

      <div className="border p-3">
        <table className="table table-dark table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Deadline</th>
              <th>Priority</th>
              <th>Type</th>
              <th>Status</th>

              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.TaskID}>
                <td>{task.TaskID}</td>
                <td>{task.TaskTitle}</td>
                <td>{task.TaskDeadline}</td>
                <td>
                  {task.PriorityID === 1
                    ? "Low"
                    : task.PriorityID === 2
                    ? "Medium"
                    : "High"}
                </td>
                <td>
                  {task.TaskTypeID === 1
                    ? "Small Task"
                    : task.TaskTypeID === 2
                    ? "Medium Task"
                    : task.TaskTypeID === 3
                    ? "Large Task"
                    : "Unknown"}
                </td>
                <td>{task.Status}</td>

                <td className="text-center">
                  {/* Add action buttons as needed */}
                  <div className="dropdown" data-bs-theme="dark">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i
                        className="fa fa-ellipsis-v fa-fw "
                        aria-hidden="true"
                      ></i>
                    </button>
                    <div
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="dropdownMenu2"
                    >
                      <button
                        className="dropdown-item btn btn-primary"
                        type="button"
                        style={{ color: "#0d6efd" }}
                        onClick={() => {
                          setShowAssignUserModal(true);
                          setSelectAssignTask(task.TaskID);
                        }}
                      >
                        <i
                          className="fa fa-user-plus me-2"
                          aria-hidden="true"
                        ></i>
                        Assign
                      </button>
                      <button
                        className="dropdown-item btn btn-info"
                        type="button"
                        style={{ color: "cyan" }}
                        onClick={() => {
                          setShowDetailTaskModal(true);
                          setSelectDetailTask(task);
                        }}
                      >
                        <i className="fa fa-eye me-2" aria-hidden="true"></i>{" "}
                        Detail
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
    </div>
  );
};

export default Assigntask;
