import React from "react";
import { Navigate } from "react-router-dom";

const Usermgmt = ({ loggedIn }) => {
  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return <div>Usermgmt</div>;
};

export default Usermgmt;
