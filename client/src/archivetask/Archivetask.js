import React from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import Detailtask from "../task/Detailtask";
import Usercard from "../approval/Usercard";
import Reportdata from "../mytask/Reportdata";
import { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";

const Archivetask = () => {
  const { loggedIn } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [showDetailTaskModal, setShowDetailTaskModal] = useState(false);
  const [showUserCardModal, setShowUserCardModal] = useState(false);
  const [showReportDataModal, setShowReportDataModal] = useState(false);
  const [selectDetailTask, setSelectDetailTask] = useState("");
  const [selectAssignedUser, setSelectAssignedUser] = useState("");
  const [selectTaskID, setSelectTaskID] = useState("");

  const getArchiveTask = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getarchivetask",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log("Archived Fetch Successfully", response.data);
        setTasks(response.data.archiveTask); // Set tasks directly from response data
      }
    } catch (error) {
      console.error(
        "Error fetching Archived tasks:",
        error.response.data.error
      );
    }
  };

  useEffect(() => {
    if (loggedIn) {
      getArchiveTask();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div className="container-fluid mt-5 p-3 border">
      <h2>Archive Task</h2>
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
                          className="fa fa-eye fa-fw me-2"
                          aria-hidden="true"
                        ></i>
                        Assigned User
                      </button>
                      <button
                        className="dropdown-item btn btn-info"
                        type="button"
                        style={{ color: "cyan" }}
                        onClick={() => {
                          setShowReportDataModal(true);
                          setSelectTaskID(task.TaskID);
                        }}
                      >
                        <i
                          className="fa fa-eye fa-fw me-2"
                          aria-hidden="true"
                        ></i>
                        Report Task
                      </button>
                    </div>
                  </div>
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
      <Reportdata
        showModal={showReportDataModal}
        TaskID={selectTaskID}
        handleClose={() => {
          setShowReportDataModal(false);
          setSelectTaskID("");
        }}
      />
    </div>
  );
};

export default Archivetask;
