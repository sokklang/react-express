import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios";

const Approval = () => {
  const { loggedIn } = useContext(AuthContext);

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
          "Request Join Tasks Fectch Sucessfully",
          response.data.taskAssignments
        );
      }
    } catch (error) {
      console.error("Error fetching tasks:", error.response.data.error);
    }
  };

  useEffect(() => {
    if (loggedIn) {
      getAllRequestJoin();
    }
  }, [loggedIn]);
  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return <div>Approval</div>;
};

export default Approval;
