import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AddTask from "./Addtask";
import Deletetask from "./Deletetask";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Task = () => {
  const { loggedIn } = useContext(AuthContext);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
  const [selectDeleteTask, setSelectDeleteTask] = useState("");
  const [tasks, setTasks] = useState([]);

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

  useEffect(() => {
    if (loggedIn) {
      fetchTasks();
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
            <h1>Task</h1>
          </center>
        </div>
        <div className="d-flex align-items-center">
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
                  <div className="dropdown">
                    <button
                      className="btn btn-secondary dropdown-toggle"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
                    </button>
                    <div
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenu2"
                    >
                      <button className="dropdown-item" type="button">
                        Action
                      </button>
                      <button class="dropdown-item" type="button">
                        Another action
                      </button>
                      <button class="dropdown-item" type="button">
                        Something else here
                      </button>
                    </div>
                  </div>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      setShowDeleteTaskModal(true);
                      setSelectDeleteTask(task.TaskID);
                    }}
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i> Delete
                  </button>
                  <Deletetask
                    showModal={showDeleteTaskModal}
                    deleteTask={deleteTask}
                    selectDeleteTask={selectDeleteTask}
                    handleClose={() => {
                      setShowDeleteTaskModal(false);
                      setSelectDeleteTask("");
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Task;
