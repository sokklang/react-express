import { Navigate } from "react-router-dom";

const Task = ({ loggedIn }) => {
  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // Render the Task component content when the user is logged in
  return <div>Task</div>;
};

export default Task;
