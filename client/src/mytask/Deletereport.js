import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const Deletereport = ({ showModal, handleClose, TaskID }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [reportData, setReportData] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);

  const getTaskDetailReport = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/gettaskdetailreport/${TaskID}`,
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log("Received report data:", response.data);
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [TaskID]);

  const arrayToBlobUrl = (array, mimeType) => {
    const blob = new Blob([Uint8Array.from(array)], { type: mimeType });
    return URL.createObjectURL(blob);
  };

  const handleDeleteReport = async () => {
    console.log(selectedReports);
    console.log(TaskID);
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/deletereportdata/${TaskID}`,
        {
          data: { selectedReports }, // Include data in the request body
          headers: {
            "Content-Type": "application/json", // Set content type to JSON
          },
          withCredentials: true,
        }
      );

      // Check response status and handle accordingly
      if (response.status === 200) {
        getTaskDetailReport();
        console.log(response.data.message);
        setErrorMessage("");
        setSuccessMessage(response.data.message);
      } else {
        console.error("Failed to delete reports:", response.data.error);
        setSuccessMessage("");
        setErrorMessage(response.data.error);
      }
    } catch (error) {
      console.error("Error deleting reports:", error.response.data.error);
      setSuccessMessage("");
      setErrorMessage(error.response.data.error);
    }
  };

  const handleSelectReport = (reportId) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter((id) => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  const onClose = async () => {
    handleClose();
    setErrorMessage("");
    setSuccessMessage("");
    setSelectedReports([]);
  };

  useEffect(() => {
    if (showModal) {
      getTaskDetailReport();
    }
  }, [showModal, getTaskDetailReport]);

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div
        className="modal-dialog modal-xl text-white text-center"
        role="document"
      >
        <div className="modal-content border border-warning">
          <div className="modal-header border-bottom border-warning">
            <h5 className="modal-title">
              <i className="fa fa-remove fa-fw me-2"></i>Remove Report
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-start">
            {reportData.map((file, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  checked={selectedReports.includes(file.ReportID)}
                  onChange={() => handleSelectReport(file.ReportID)}
                />
                {file.ReportType.startsWith("image/") && (
                  <img
                    className="mb-3"
                    src={arrayToBlobUrl(file.ReportData.data, file.ReportType)}
                    alt={`Report ${index}`}
                    style={{ maxWidth: "100%" }}
                  />
                )}
                {file.ReportType === "application/pdf" && (
                  <embed
                    className="mb-3"
                    src={arrayToBlobUrl(file.ReportData.data, file.ReportType)}
                    type="application/pdf"
                    style={{ width: "100%", height: "calc(100vw / 1.414)" }}
                  />
                )}
                {/* Add other conditions for different types of reports */}
              </div>
            ))}
            {errorMessage ? (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            ) : successMessage ? (
              <div className="alert alert-success mt-3" role="alert">
                {successMessage}
              </div>
            ) : null}
          </div>
          <div className="modal-footer border-top border-warning">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-warning"
              onClick={handleDeleteReport}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deletereport;
