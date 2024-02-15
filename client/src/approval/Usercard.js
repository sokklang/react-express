import React from "react";
import defaultProfileImage from "../profile/profile.jpg";
import axios from "axios";
import { useEffect, useState } from "react";

const Usercard = ({ user, showModal, handleClose }) => {
  const [profiles, setProfiles] = useState([]);

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

  useEffect(() => {
    if (showModal && user) {
      getMultiProfileInfo(user);
    }
  }, [showModal, user]);

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
              <i className="fa fa-user-plus fa-fw me-2"></i>Assigned To
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body text-white text-start">
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
                  }}
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
                        className="card-img-top"
                        style={{ maxWidth: "150px", maxHeight: "150px" }}
                      />
                    ) : (
                      <img
                        src={defaultProfileImage}
                        alt={`Default Profile for ${profile.Username}`}
                        className="card-img-top"
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
                onClick={handleClose}
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

export default Usercard;
