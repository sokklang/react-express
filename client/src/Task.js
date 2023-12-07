import { Navigate } from "react-router-dom";
import { useState } from "react";
const Task = ({ loggedIn }) => {
  const [tasks, setTasks] = useState([
    // Sample task data (replace with actual data from your system)
    {
      id: 1,
      title: "Task 1",
      description: "Complete task 1 description...",
      dueDate: "2023-12-10",
      priority: "High",
      status: "In Progress",
    },
  ]);

  const handleAddTask = () => {
    // Add your logic to handle adding a new task
    console.log("Add Task clicked");
  };

  const handleEditTask = (taskId) => {
    // Add your logic to handle editing a task
    console.log(`Edit Task clicked for task ID: ${taskId}`);
  };

  const handleSaveTask = () => {
    // Add your logic to handle saving a task
    console.log("Save Task clicked");
  };
  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // Render the Task component content when the user is logged in
  return (
    <div>
      <h2>Task Management</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.dueDate}</td>
              <td>{task.priority}</td>
              <td>{task.status}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditTask(task.id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={handleAddTask}>
        Add Task
      </button>

      {/* Add Task Modal */}
      {/* (Similar structure as the Bootstrap example, but using React state and components) */}

      {/* Edit Task Modal */}
      {/* (Similar structure as the Bootstrap example, but using React state and components) */}
    </div>
  );
};

export default Task;
