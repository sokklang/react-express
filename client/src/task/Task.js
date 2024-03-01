import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AddTask from "./Addtask";
import Deletetask from "./Deletetask";
import Detailtask from "./Detailtask";
import Updatetask from "./Updatetask";
import RequestJoinModal from "./Requestjoinmodal";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Task = () => {
  const { loggedIn, userroletype } = useContext(AuthContext);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [showDetailTaskModal, setShowDetailTaskModal] = useState(false);
  const [showUpdateTaskModal, setShowUpdateTaskModal] = useState(false);
  const [selectDeleteTask, setSelectDeleteTask] = useState("");
  const [selectDetailTask, setSelectDetailTask] = useState("");
  const [selectUpdateTask, setSelectUpdateTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showRequestJoinModal, setShowRequestJoinModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/gettask", {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("Tasks Fectch Sucessfully", response.data.tasks);
        setTasks(response.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data.error);
    }
  };

  const deleteTask = async (taskid) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deletetask/${taskid}`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log(response.data.message);
        // Trigger useEffect by calling fetchUserData
        fetchTasks();
      }
    } catch (error) {
      console.error(error.response.data.error);

      throw error;
    }
  };

  const updateTask = async (updateTaskData) => {
    const taskid = selectUpdateTask.TaskID;
    try {
      const response = await axios.put(
        `http://localhost:5000/api/updatetask/${taskid}`,
        updateTaskData,
        { withCredentials: true }
      );
      console.log(updateTaskData);
      if (response.status === 200) {
        fetchTasks();
        setSuccessMessage(response.data.message);
        setErrorMessage("");
      }
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
    }
  };

  const approveTask = async (taskid) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/approvetask/${taskid}`,
        null,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log(response.data.message);
        // Trigger useEffect by calling fetchUserData
        fetchTasks();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const requestJoinTask = async (taskid) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/requestjointask/${taskid}`,
        null,
        { withCredentials: true }
      );
      if (response.status === 200) {
        console.log(response.data.message);
        setShowRequestJoinModal(true);
        setErrorMessage("");
        setSuccessMessage(response.data.message);
        // Trigger useEffect by calling fetchUserData
        fetchTasks();
      }
    } catch (error) {
      console.error("Error:", error.response.data.error);
      setShowRequestJoinModal(true);
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      fetchTasks();
      //const interval = setInterval(fetchTasks, 5000); // Polling every 5 seconds
      //return () => clearInterval(interval);
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div className="container-fluid mt-5 p-3 border">
      <div
        className={`offcanvas offcanvas-start${showSidebar ? " show" : ""} `}
        data-bs-theme="dark"
        id="sidebar"
        aria-labelledby="sidebarLabel"
      >
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="sidebarLabel">
            Tasks Action
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowSidebar(false)}
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            <li className="nav-item ">
              <Link className="nav-link" to="/mytask">
                <i className="fa fa-calendar fa-fw me-2"></i>MyTask
              </Link>
            </li>
            {userroletype === "Admin User" && (
              <li className="nav-item">
                <Link className="nav-link" to="/assigntask">
                  <i className="fa fa-list fa-fw me-2"></i>AssignTask
                </Link>
              </li>
            )}
            {userroletype === "Admin User" && (
              <li className="nav-item">
                <Link className="nav-link" to="/approval">
                  <i className="fa fa-check fa-fw me-2"></i>Approval
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link className="nav-link" to="/archivetask">
                <i className="fa fa-archive fa-fw me-2"></i>Archive Tasks
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <center>
            <h1>Task</h1>
          </center>
        </div>
        <div className="d-flex align-items-center">
          <button
            type="button"
            className="btn btn-primary text-nowrap me-3"
            onClick={() => setShowSidebar(true)}
          >
            <i className="fa fa-bars me-2" aria-hidden="true"></i>Options
          </button>
          <button
            type="button"
            className="btn btn-primary text-nowrap"
            onClick={() => setShowAddTaskModal(true)}
          >
            <i className="fa fa-plus me-2" aria-hidden="true"></i>Add
          </button>
          <AddTask
            showModal={showAddTaskModal}
            fetchTasks={fetchTasks}
            handleClose={() => {
              setShowAddTaskModal(false);
            }}
          />
          <RequestJoinModal
            errorMessage={errorMessage}
            successMessage={successMessage}
            showModal={showRequestJoinModal}
            handleClose={() => {
              setShowRequestJoinModal(false);
              setErrorMessage("");
              setSuccessMessage("");
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
              <th>ApprovalStatus</th>

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
                <td>{task.ApprovalStatus}</td>

                <td className="text-center">
                  {/* Add action buttons as needed */}
                  <div className="dropdown" data-bs-theme="dark">
                    <button
                      className="btn btn-outline-primary dropdown-toggle"
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
                        className="dropdown-item btn btn-info"
                        type="button"
                        style={{ color: "cyan" }}
                        onClick={() => {
                          setShowDetailTaskModal(true);
                          setSelectDetailTask(task);
                        }}
                      >
                        <i
                          className="fa fa-eye fa-fw me-2"
                          aria-hidden="true"
                        ></i>
                        Detail
                      </button>

                      <button
                        className="dropdown-item btn btn-primary"
                        type="button"
                        style={{ color: "#0d6efd" }}
                        onClick={() => {
                          setShowUpdateTaskModal(true);
                          setSelectUpdateTask(task);
                        }}
                      >
                        <i
                          className="fa fa-pencil fa-fw me-2"
                          aria-hidden="true"
                        ></i>
                        Update
                      </button>
                      {userroletype === "Standard User" &&
                        task.ApprovalStatus === "Approved" && (
                          <button
                            className="dropdown-item btn btn-success"
                            type="button"
                            style={{ color: "#00FF00" }}
                            onClick={() => {
                              requestJoinTask(task.TaskID);
                            }}
                          >
                            <i
                              className="fa fa fa-user-plus fa-fw me-2"
                              aria-hidden="true"
                            ></i>
                            Request Join
                          </button>
                        )}
                      {userroletype === "Admin User" &&
                        task.ApprovalStatus !== "Approved" && (
                          <button
                            className="dropdown-item btn btn-success"
                            type="button"
                            style={{ color: "#00FF00" }}
                            onClick={() => {
                              approveTask(task.TaskID);
                            }}
                          >
                            <i
                              className="fa fa-check fa-fw me-2"
                              aria-hidden="true"
                            ></i>
                            Approve
                          </button>
                        )}
                      <div className="dropdown-divider"></div>
                      <button
                        className="dropdown-item btn btn-danger"
                        type="button"
                        style={{ color: "red" }}
                        onClick={() => {
                          setShowDeleteTaskModal(true);
                          setSelectDeleteTask(task.TaskID);
                        }}
                      >
                        <i
                          className="fa fa-trash fa-fw me-2"
                          aria-hidden="true"
                        ></i>
                        Delete
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Updatetask
        showModal={showUpdateTaskModal}
        updateTask={updateTask}
        selectUpdateTask={selectUpdateTask}
        successMessage={successMessage}
        errorMessage={errorMessage}
        handleClose={() => {
          setShowUpdateTaskModal(false);
          setSelectUpdateTask("");
          setErrorMessage("");
          setSuccessMessage("");
        }}
      />

      <Deletetask
        showModal={showDeleteTaskModal}
        deleteTask={deleteTask}
        selectDeleteTask={selectDeleteTask}
        handleClose={() => {
          setShowDeleteTaskModal(false);
          setSelectDeleteTask("");
        }}
      />
    </div>
  );
};

export default Task;
