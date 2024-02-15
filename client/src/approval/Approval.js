import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import axios from "axios";

import Usercard from "./Usercard";
import Usercardselect from "./Usercardselect";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.min.css";

const Approval = () => {
  const { loggedIn } = useContext(AuthContext);
  const [requestList, setRequestList] = useState([]);

  const [showUserCardModal, setShowUserCardModal] = useState(false);
  const [showUserCardSelectModal, setShowUserCardSelectModal] = useState(false);
  const [selectAssignedUser, setSelectAssignedUser] = useState("");
  const [selectRequestUser, setSelectRequestUser] = useState("");
  const [selectTaskId, setSelectTaskId] = useState("");

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
            <th>Assigned Profile</th>
            <th>Request Profile</th>
          </tr>
        </thead>
        <tbody>
          {requestList.map((request, index) => (
            <tr key={index}>
              <td>{request.AssignmentID}</td>
              <td>{request.TaskID}</td>
              <td>{request.AssignedUserID}</td>
              <td>{request.RequestJoinUserID}</td>
              <td>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    setShowUserCardModal(true);
                    setSelectAssignedUser(JSON.parse(request.AssignedUserID));
                  }}
                >
                  <i className="fa fa-eye fa-fw me-2" aria-hidden="true"></i>{" "}
                  Detail
                </button>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => {
                    setShowUserCardSelectModal(true);
                    setSelectRequestUser(JSON.parse(request.RequestJoinUserID));
                    setSelectTaskId(request.TaskID);
                  }}
                >
                  <i className="fa fa-check fa-fw me-2" aria-hidden="true"></i>{" "}
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </div>
  );
};

export default Approval;
