import React from "react";
import defaultProfileImage from "../profile/profile.jpg";
import axios from "axios";
import { useEffect, useState } from "react";

const Usercardselect = ({
  showModal,
  handleClose,
  user,
  taskid,
  getAllRequestJoin,
}) => {
  const [profiles, setProfiles] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const getMultiProfileInfo = async (userid) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/getmultiprofileinfo",
        { userid },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        //return response.data;
        //
        setProfiles(response.data);
      }
    } catch (error) {
      console.error(
        "Error fetching profile information:",
        error.response.data.error
      );
    }
  };

  const arrayToBlobUrl = (array, mimeType) => {
    const blob = new Blob([Uint8Array.from(array)], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  const handleApproveRequestJoin = async (e) => {
    e.preventDefault();
    try {
      const taskId = taskid; // Assuming selectAssignTask is the taskId
      const userIds = selectedUsers; // Assuming selectedUsers is the array of user IDs
      const response = await axios.put(
        "http://localhost:5000/api/approverequestjoin",
        { taskId, userIds }, // Adjusted parameter names here
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        console.log(response.data);
        getAllRequestJoin();
        onClose();
      }
    } catch (error) {
      console.error("Error ApproveJoin:", error.response.data.error);
    }
  };

  const handleUserSelection = (userId) => {
    const newSelectedUsers = selectedUsers.includes(userId)
      ? selectedUsers.filter((id) => id !== userId)
      : [...selectedUsers, userId];

    setSelectedUsers(newSelectedUsers);

    //console.log("Selected Users:", newSelectedUsers); // Log the selectedUsers array
  };

  useEffect(() => {
    if (showModal && user) {
      getMultiProfileInfo(user);
    }
  }, [showModal, user]);

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
              <i className="fa fa-check fa-fw me-2"></i>Approve Join
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
            <form onSubmit={handleApproveRequestJoin}>
              {/* Iterate over user profiles and display them */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "flex-start",
                }}
              >
                {profiles.map((profile) => (
                  <div
                    key={profile.UserID}
                    className="card mb-3"
                    style={{
                      flex: "0 1 calc(25% - 1em)",
                      margin: "0.5em",
                      backgroundColor: selectedUsers.includes(profile.UserID)
                        ? "#007bff"
                        : "",
                      color: selectedUsers.includes(profile.UserID)
                        ? "white"
                        : "",
                    }}
                    onClick={() => handleUserSelection(profile.UserID)}
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
                      {profile.ImageData ? (
                        <img
                          src={arrayToBlobUrl(
                            profile.ImageData.data,
                            "image/jpeg"
                          )}
                          alt={`Profile for ${profile.Username}`}
                          className="card-img-top rounded "
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                      ) : (
                        <img
                          src={defaultProfileImage}
                          alt={`Default Profile for ${profile.Username}`}
                          className="card-img-top rounded "
                          style={{ maxWidth: "150px", maxHeight: "150px" }}
                        />
                      )}
                      <div className="card-text">
                        <p className="mb-0">User ID: {profile.UserID}</p>
                        <p className="mb-0">Username: {profile.Username}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

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

export default Usercardselect;
