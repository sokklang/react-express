import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios";
import Detailtask from "../task/Detailtask";
import Usercard from "../approval/Usercard";
import Closereport from "./Closereport";
import Submitreport from "./Submitreport";
import Reportdata from "./Reportdata";
import Deletereport from "./Deletereport";
import Archivetask from "./Archivetaskmodal";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Mytask = () => {
  const { loggedIn } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showDetailTaskModal, setShowDetailTaskModal] = useState(false);
  const [showUserCardModal, setShowUserCardModal] = useState(false);
  const [showCloseReportModal, setShowCloseReportModal] = useState(false);
  const [showSubmitReportModal, setShowSubmitReportModal] = useState(false);
  const [showDeleteReportModal, setShowDeleteReportModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showReportDataModal, setShowReportDataModal] = useState(false);
  const [selectDetailTask, setSelectDetailTask] = useState("");
  const [selectTaskID, setSelectTaskID] = useState("");

  const [selectAssignedUser, setSelectAssignedUser] = useState("");

  const FetchMyTasks = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/getmytasks", {
        withCredentials: true,
      });
      if (response.status === 200) {
        console.log("MyTasks Fetch Successfully", response.data);
        setTasks(response.data); // Set tasks directly from response data
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data.error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      FetchMyTasks();
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
            <h1>MyTasks</h1>
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

              <th className="text-center">Detail</th>
              <th className="text-center">Action</th>
              <th className="text-center">Report</th>
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
                      className="btn btn-outline-info dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fa fa-eye fa-fw " aria-hidden="true"></i>
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
                        Detail Task
                      </button>
                      <button
                        className="dropdown-item btn btn-info"
                        type="button"
                        style={{ color: "cyan" }}
                        onClick={() => {
                          setShowUserCardModal(true);
                          setSelectAssignedUser(
                            JSON.parse(task.AssignedUserID)
                          );
                        }}
                      >
                        <i
                          className="fa fa-eye fa-fw me-2 "
                          aria-hidden="true"
                        ></i>{" "}
                        View Assigned
                      </button>
                    </div>
                  </div>
                </td>
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
                        className="fa fa-ellipsis-v fa-fw"
                        aria-hidden="true"
                      ></i>
                    </button>
                    <div
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="dropdownMenu2"
                    >
                      <button
                        className="dropdown-item btn btn-success"
                        type="button"
                        style={{ color: "#00FF00" }}
                        onClick={() => {
                          setShowSubmitReportModal(true);
                          setSelectTaskID(task.TaskID);
                        }}
                      >
                        <i
                          className="fa fa-paper-plane fa-fw me-2"
                          aria-hidden="true"
                        ></i>
                        Submit Report
                      </button>

                      <button
                        className="dropdown-item btn btn-warning"
                        type="button"
                        style={{ color: "yellow" }}
                        onClick={() => {
                          setShowDeleteReportModal(true);
                          setSelectTaskID(task.TaskID);
                        }}
                      >
                        <i
                          className="fa fa-remove fa-fw me-2"
                          aria-hidden="true"
                        ></i>
                        Remove Report
                      </button>
                      {task.Status === "Starting" ? (
                        <button
                          className="dropdown-item btn btn-danger"
                          type="button"
                          style={{ color: "red" }}
                          onClick={() => {
                            setShowCloseReportModal(true);
                            setSelectTaskID(task.TaskID);
                          }}
                        >
                          <i
                            className="fa fa-hourglass-end fa-fw me-2"
                            aria-hidden="true"
                          ></i>{" "}
                          Close Report
                        </button>
                      ) : (
                        <button
                          className="dropdown-item btn btn-info"
                          type="button"
                          style={{ color: "cyan" }}
                          onClick={() => {
                            setShowArchiveModal(true);
                            setSelectTaskID(task.TaskID);
                          }}
                        >
                          <i
                            className="fa fa-archive fa-fw me-2"
                            aria-hidden="true"
                          ></i>{" "}
                          Archive
                        </button>
                      )}
                    </div>
                  </div>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-outline-info me-2"
                    onClick={() => {
                      setShowReportDataModal(true);
                      setSelectTaskID(task.TaskID);
                    }}
                  >
                    <i className="fa fa-eye fa-fw" aria-hidden="true"></i>{" "}
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Detailtask
        showModal={showDetailTaskModal}
        selectDetailTask={selectDetailTask}
        handleClose={() => {
          setShowDetailTaskModal(false);
          setSelectDetailTask("");
        }}
      />
      <Usercard
        showModal={showUserCardModal}
        user={selectAssignedUser}
        handleClose={() => {
          setShowUserCardModal(false);
          setSelectAssignedUser("");
        }}
      />
      <Closereport
        showModal={showCloseReportModal}
        TaskID={selectTaskID}
        handleClose={() => {
          setShowCloseReportModal(false);
          setSelectTaskID("");
        }}
        FetchMyTasks={FetchMyTasks}
      />
      <Submitreport
        showModal={showSubmitReportModal}
        TaskID={selectTaskID}
        handleClose={() => {
          setShowSubmitReportModal(false);
          setSelectTaskID("");
        }}
      />

      <Reportdata
        showModal={showReportDataModal}
        TaskID={selectTaskID}
        handleClose={() => {
          setShowReportDataModal(false);
          setSelectTaskID("");
        }}
      />

      <Deletereport
        showModal={showDeleteReportModal}
        TaskID={selectTaskID}
        handleClose={() => {
          setShowDeleteReportModal(false);
          setSelectTaskID("");
        }}
      />

      <Archivetask
        showModal={showArchiveModal}
        TaskID={selectTaskID}
        FetchMyTasks={FetchMyTasks}
        handleClose={() => {
          setShowArchiveModal(false);
          setSelectTaskID("");
        }}
      />
    </div>
  );
};

export default Mytask;
