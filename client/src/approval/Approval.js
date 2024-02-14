import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Approval = () => {
  const { loggedIn } = useContext(AuthContext);
  const [requestList, setRequestList] = useState([]);

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

  return (
    <div>
      <h2>Requests for Approval</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Assignment ID</th>
            <th>Task ID</th>
            <th>Assigned Users</th>
            <th>Requesting User</th>
          </tr>
        </thead>
        <tbody>
          {requestList.map((request, index) => (
            <tr key={index}>
              <td>{request.AssignmentID}</td>
              <td>{request.TaskID}</td>
              <td>
                {JSON.parse(request.AssignedUserID).map((userId, index) => (
                  <span key={index}>
                    {index !== 0 && ", "}
                    {userId}
                  </span>
                ))}
              </td>
              <td>
                {JSON.parse(request.RequestJoinUserID).map((userId, index) => (
                  <span key={index}>
                    {index !== 0 && ", "}
                    {userId}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Approval;
