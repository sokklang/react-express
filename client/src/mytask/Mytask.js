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

  const calculateDaysLeft = (deadline) => {
    const deadlineDate = new Date(deadline);
    const currentDate = new Date();
    const timeDiff = deadlineDate.getTime() - currentDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
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
    <div className="container-fluid mt-5 p-3 border" data-bs-theme="dark">
      <h1 className="text-center mb-3">MyTasks</h1>

      <div className="row">
        {tasks.map((task) => (
          <div key={task.TaskID} className="col-lg-4 mb-3">
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
                <h5 className="card-title">
                  <i className="fa fa-tasks fa-fw me-2"></i>
                  {task.TaskTitle}
                </h5>
                <div className="btn-group">
                  <button
                    className="btn btn-outline-info"
                    onClick={() => {
                      setShowDetailTaskModal(true);
                      setSelectDetailTask(task);
                    }}
                  >
                    <i className="fa fa-eye fa-fw"></i> Task
                  </button>
                  <button
                    className="btn btn-outline-info me-2"
                    onClick={() => {
                      setShowUserCardModal(true);
                      setSelectAssignedUser(JSON.parse(task.AssignedUserID));
                    }}
                  >
                    <i className="fa fa-user fa-fw"></i> View
                  </button>
                </div>
              </div>

              <div className="card-body">
                <p className="card-text">
                  <strong>Remaining:</strong>{" "}
                  {calculateDaysLeft(task.TaskDeadline)}{" "}
                  <i className="fa fa-hourglass-end fa-fw me-1"></i>Days
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
                    <span className="text-info">
                      <i className="fa fa-check fa-fw me-1"></i>Small Task
                    </span>
                  ) : task.TaskTypeID === 2 ? (
                    <span className="text-info">
                      <i className="fa fa-list fa-fw me-1"></i>Medium Task
                    </span>
                  ) : task.TaskTypeID === 3 ? (
                    <span className="text-info">
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
                <div className="text-center">
                  <div className="btn-group mb-2">
                    <button
                      className="btn btn-outline-success "
                      onClick={() => {
                        setShowSubmitReportModal(true);
                        setSelectTaskID(task.TaskID);
                      }}
                    >
                      <i className="fa fa-paper-plane fa-fw"></i> Submit
                    </button>
                    <button
                      className="btn btn-outline-info "
                      onClick={() => {
                        setShowReportDataModal(true);
                        setSelectTaskID(task.TaskID);
                      }}
                    >
                      <i className="fa fa-file fa-fw"></i> View
                    </button>

                    <button
                      className="btn btn-outline-warning"
                      onClick={() => {
                        setShowDeleteReportModal(true);
                        setSelectTaskID(task.TaskID);
                      }}
                    >
                      <i className="fa fa-remove fa-fw"></i> Remove
                    </button>
                  </div>
                </div>
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
                <div className="btn-group mb-2">
                  {task.Status === "Starting" ? (
                    <button
                      className="btn btn-outline-danger me-2"
                      onClick={() => {
                        setShowCloseReportModal(true);
                        setSelectTaskID(task.TaskID);
                      }}
                    >
                      <i className="fa fa-hourglass-end fa-fw "></i> Close
                      Report
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-secondary me-2"
                      onClick={() => {
                        setShowArchiveModal(true);
                        setSelectTaskID(task.TaskID);
                      }}
                    >
                      <i className="fa fa-archive fa-fw"></i> Archive
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
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
