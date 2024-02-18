import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import defaultProfileImage from "../profile/profile.jpg";

const Detailtask = ({ showModal, handleClose, selectDetailTask }) => {
  const [profileImage, setProfileImage] = useState(null);
  const convertTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Invalid Timestamp";
    }

    // Split date and time parts
    const [datePart, timePart] = timestamp.split(" ");

    // Split date into year, month, and day
    const [year, month, day] = datePart.split("-");

    // Split time into hours, minutes, and seconds
    const [hours, minutes, seconds] = timePart.split(":");

    // Create a new Date object
    const date = new Date(
      Date.UTC(year, month - 1, day, hours, minutes, seconds)
    );

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Timestamp";
    }

    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    };

    return date.toLocaleString(undefined, options);
  };

  const fetchUserProfile = async (userid) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/getuserprofileadmin/${userid}`, // Update the URL based on your backend route
        { withCredentials: true, responseType: "arraybuffer" } // Set the responseType to 'arraybuffer' to receive the data as an ArrayBuffer
      );

      if (response.status === 200) {
        // Access the binary data from the response
        const imageData = response.data;
        console.log("imagedata", imageData);

        // Convert the ArrayBuffer to a Blob
        const blob = new Blob([imageData], { type: "image/jpeg" }); // Replace 'image/jpeg' with the actual MIME type of your images

        // Create a Blob URL from the Blob
        const blobUrl = URL.createObjectURL(blob);

        setProfileImage(blobUrl);
        console.log("Fetched user profile image data:", blobUrl);
      }
    } catch (error) {
      console.error("Error fetching user profile data:", error);
    }
  };

  const onClose = () => {
    handleClose();
    setProfileImage("");
  };

  useEffect(() => {
    //console.log("showModal:", showModal);
    //console.log("selectDetailUser:", selectDetailUser);

    if (showModal && selectDetailTask) {
      fetchUserProfile(selectDetailTask.UserID);
    }
  }, [showModal, selectDetailTask]);

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog text-white text-center" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa fa-info fa-fw"></i>Task Title :{" "}
              {selectDetailTask.TaskTitle}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {profileImage ? (
              <div>
                <img
                  className="rounded"
                  src={profileImage}
                  alt="Profile"
                  style={{ maxWidth: "150px" }}
                />
                <p>Task created By: {selectDetailTask.UserID}</p>
              </div>
            ) : (
              <div>
                <img
                  src={defaultProfileImage}
                  alt="Default Profile"
                  style={{ maxWidth: "100px" }}
                />
                <p>Task created By: {selectDetailTask.UserID}</p>
              </div>
            )}
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Task ID:</label>
                <p>{selectDetailTask.TaskID}</p>
              </div>
              <div className="col-md-6">
                <label>Task Description:</label>
                <p>{selectDetailTask.TaskDescription}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Task Priority:</label>
                <p>
                  {selectDetailTask.PriorityID === 1
                    ? "Low"
                    : selectDetailTask.PriorityID === 2
                    ? "Medium"
                    : "High"}
                </p>
              </div>
              <div className="col-md-6">
                <label>Task Type:</label>
                <p>
                  {selectDetailTask.TaskTypeID === 1
                    ? "Small Task"
                    : selectDetailTask.TaskTypeID === 2
                    ? "Medium Task"
                    : selectDetailTask.TaskTypeID === 3
                    ? "Large Task"
                    : "Unknown"}
                </p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Status:</label>
                <p>{selectDetailTask.Status}</p>
              </div>
              <div className="col-md-6">
                <label>ApprovalStatus:</label>
                <p>{selectDetailTask.ApprovalStatus}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>ApproverUserID:</label>
                <p>{selectDetailTask.ApproverUserID}</p>
              </div>
              <div className="col-md-6">
                <label>ApprovalTimestamp:</label>
                <p>{selectDetailTask.ApprovalTimestamp}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>TaskCreationDate: </label>
                <p>{convertTimestamp(selectDetailTask.TaskCreationDate)}</p>
              </div>
              <div className="col-md-6">
                <label>DependentTaskID: </label>
                <p>{selectDetailTask.DependentTaskID}</p>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailtask;
