import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import defaultProfileImage from "../profile/profile.jpg";

const Assignuser = ({ showModal, handleClose, selectAssignTask }) => {
  const [userProfiles, setUserProfiles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const arrayToBlobUrl = (array, mimeType) => {
    const blob = new Blob([Uint8Array.from(array)], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  const fetchUserCompany = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/getuserprofileadmincompany",
        {
          withCredentials: true,
        }
      );
      console.log("user", response.data);
      setUserProfiles(response.data);
      setErrorMessage(""); // Clear any previous errors
      setSuccessMessage(""); // Clear success message as well
    } catch (error) {
      setErrorMessage("Error fetching user profiles");
      console.error(error);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();

    try {
      const taskId = selectAssignTask; // Assuming selectAssignTask is the taskId
      const assignedUserIds = selectedUsers; // Assuming selectedUsers is the array of user IDs
      //console.log("assigneduser", assignedUserIds);

      if (!taskId || !assignedUserIds || assignedUserIds.length === 0) {
        setSuccessMessage("");
        setErrorMessage("Task ID and at least one assigned user are required.");
        return;
      }

      // Perform your request to the server with taskId and assignedUserIds
      const response = await axios.post(
        "http://localhost:5000/api/assigntask",
        { taskId, assignedUserIds },
        {
          withCredentials: true,
          // Add any other necessary configurations for your request
        }
      );

      // Handle the response from the server
      console.log(response.data);
      setErrorMessage("");
      setSuccessMessage(response.data.message);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
      console.error(error);
    }
  };

  const handleUserSelection = (userId) => {
    setSelectedUsers((prevSelectedUsers) => {
      // Ensure prevSelectedUsers is always an array
      const currentSelectedUsers = Array.isArray(prevSelectedUsers)
        ? prevSelectedUsers
        : selectedUsers;

      //console.log("currentSelectedUsers", currentSelectedUsers);

      const newSelectedUsers = currentSelectedUsers.includes(userId)
        ? currentSelectedUsers.filter((id) => id !== userId)
        : [...currentSelectedUsers, userId];

      //console.log("Selected Users:", newSelectedUsers); // Log the selectedUsers array

      return newSelectedUsers;
    });
  };

  const fetchAssignedUsers = useCallback(async () => {
    try {
      const taskId = selectAssignTask;
      const response = await axios.get(
        `http://localhost:5000/api/getusertaskassigned/${taskId}`,
        {
          withCredentials: true,
        }
      );

      // Assuming the backend response has a structure like { assignedUserIds: "[1,2,3]" } String Format
      const { assignedUserIds } = response.data;

      // Parse the retrieved string into an array using JSON.parse()
      const parsedAssignedUserIds = JSON.parse(assignedUserIds);

      // Set the retrieved user IDs in the state
      setSelectedUsers(parsedAssignedUserIds);
    } catch (error) {
      console.error(error);
    }
  }, [selectAssignTask]);

  useEffect(() => {
    if (showModal) {
      // Call fetchUserCompany only when showModal is true
      fetchUserCompany();
      fetchAssignedUsers();
    }
  }, [showModal, fetchAssignedUsers]);

  const onClose = () => {
    handleClose();
    setSelectedUsers([]);
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered ">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-white">
              <i className="fa fa-user-plus fa-fw me-2"></i>Assign To
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
            <form onSubmit={handleAssignTask}>
              {/* Iterate over user profiles and display them */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}
              >
                {userProfiles.map((user) => (
                  <div
                    key={user.UserID}
                    className="card mb-3"
                    style={{
                      flex: "0 1 calc(25% - 1em)",
                      margin: "0.5em",
                      backgroundColor: selectedUsers.includes(user.UserID)
                        ? "#007bff"
                        : "",
                      color: selectedUsers.includes(user.UserID) ? "white" : "",
                    }}
                    onClick={() => handleUserSelection(user.UserID)}
                  >
                    <div
                      className="card-body"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {user.ImageData ? (
                        // Convert Buffer to Blob and create Blob URL
                        <img
                          src={arrayToBlobUrl(
                            user.ImageData.data,
                            "image/jpeg"
                          )}
                          alt={`Profile for ${user.Username}`}
                          className="card-img-top"
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                      ) : (
                        // Render default profile image if ImageData is not available
                        <img
                          src={defaultProfileImage}
                          alt={`Default Profile for ${user.Username}`}
                          className="card-img-top"
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                      )}

                      <div className="card-text">
                        <p className="mb-0">User ID: {user.UserID}</p>
                        <p className="mb-0">Username: {user.Username}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {errorMessage && (
                <div className="alert alert-danger mt-3" role="alert">
                  {errorMessage}
                </div>
              )}
              {successMessage && (
                <div className="alert alert-success mt-3" role="alert">
                  {successMessage}
                </div>
              )}

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={onClose}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignuser;
