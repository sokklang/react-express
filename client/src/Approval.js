import React from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const Approval = () => {
  const { loggedIn } = useContext(AuthContext);
  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return <div>Approval</div>;
};

export default Approval;
