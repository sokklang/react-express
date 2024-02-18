import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios";

import Usercard from "./Usercard";
import Usercardselect from "./Usercardselect";
import Detailtask from "../task/Detailtask";
import Deletetask from "../task/Deletetask";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Approval = () => {
  const { loggedIn } = useContext(AuthContext);
  const [requestList, setRequestList] = useState([]);

  const [showUserCardModal, setShowUserCardModal] = useState(false);
  const [showUserCardSelectModal, setShowUserCardSelectModal] = useState(false);
  const [showDetailTaskModal, setShowDetailTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [selectAssignedUser, setSelectAssignedUser] = useState("");
  const [selectRequestUser, setSelectRequestUser] = useState("");
  const [selectTaskId, setSelectTaskId] = useState("");
  const [selectDetailTask, setSelectDetailTask] = useState("");
  const [selectDeleteTask, setSelectDeleteTask] = useState("");
  const [tasks, setTasks] = useState([]);

  const getAllRequestJoin = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getallrequestjoin",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(
          "Request Join Tasks Fetched Successfully",
          response.data.taskAssignments
        );

        setRequestList(response.data.taskAssignments);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data.message);
      setRequestList([]);
    }
  };

  const fetchPendingApproveTasks = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getpendingapprovetask",
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(
          "Pending Tasks Fetched Successfully",
          response.data.pendingApprovedTasks
        );
        setTasks(response.data.pendingApprovedTasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data.error);
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
        fetchPendingApproveTasks();
      }
    } catch (error) {
      console.error("Error:", error);
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
        fetchPendingApproveTasks();
      }
    } catch (error) {
      console.error(error.response.data.error);

      throw error;
    }
  };

  useEffect(() => {
    if (loggedIn) {
      getAllRequestJoin();
      fetchPendingApproveTasks();
    }
  }, [loggedIn]);

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div className="container-fluid mt-5 p-3 border">
      <h2>Requests for Approval</h2>
      <div className="border p-3">
        <table className="table table-dark table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Task Detail</th>
              <th>Assigned Users</th>
              <th>Requesting User</th>
            </tr>
          </thead>
          <tbody>
            {requestList.map((request, index) => (
              <tr key={index}>
                <td>{request.TaskTitle}</td>
                <td>
                  <button
                    className="btn btn-outline-info"
                    type="button"
                    onClick={() => {
                      setShowDetailTaskModal(true);
                      setSelectDetailTask(request);
                    }}
                  >
                    <i className="fa fa-eye fa-fw " aria-hidden="true"></i> View
                  </button>
                </td>

                <td>
                  <button
                    className="btn btn-outline-info"
                    type="button"
                    onClick={() => {
                      setShowUserCardModal(true);
                      setSelectAssignedUser(JSON.parse(request.AssignedUserID));
                    }}
                  >
                    <i className="fa fa-eye fa-fw " aria-hidden="true"></i>{" "}
                    Detail
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    onClick={() => {
                      setShowUserCardSelectModal(true);
                      setSelectRequestUser(
                        JSON.parse(request.RequestJoinUserID)
                      );
                      setSelectTaskId(request.TaskID);
                    }}
                  >
                    <i className="fa fa-check fa-fw " aria-hidden="true"></i>{" "}
                    Approve
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Tasks Created by Users</h2>
      <div className="border p-3">
        <table className="table table-dark table-striped table-hover table-bordered">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Task Detail</th>
              <th>Task Priority</th>
              <th>Task Type</th>

              <th>ApprovalStatus</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.TaskID}>
                <td>{task.TaskTitle}</td>
                <td>
                  <button
                    className="btn btn-outline-info "
                    type="button"
                    onClick={() => {
                      setShowDetailTaskModal(true);
                      setSelectDetailTask(task);
                    }}
                  >
                    <i className="fa fa-eye fa-fw " aria-hidden="true"></i> View
                  </button>
                </td>
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

                <td>{task.ApprovalStatus}</td>

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
                        ></i>{" "}
                        Approve
                      </button>
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
                        ></i>{" "}
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

      <Usercard
        showModal={showUserCardModal}
        user={selectAssignedUser}
        handleClose={() => {
          setShowUserCardModal(false);
          setSelectAssignedUser("");
        }}
      />

      <Usercardselect
        showModal={showUserCardSelectModal}
        user={selectRequestUser}
        taskid={selectTaskId}
        getAllRequestJoin={getAllRequestJoin}
        handleClose={() => {
          setShowUserCardSelectModal(false);
          setSelectRequestUser("");
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

export default Approval;
