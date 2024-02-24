import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Reportdata = ({ showModal, handleClose, TaskID }) => {
  const [reportData, setReportData] = useState([]);

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

  const onClose = () => {
    handleClose();
  };

  const arrayToBlobUrl = (array, mimeType) => {
    const blob = new Blob([Uint8Array.from(array)], { type: mimeType });
    return URL.createObjectURL(blob);
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
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fa fa-info fa-fw me-2"></i>Report
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {reportData.map((file, index) => (
              <div key={index}>
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
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportdata;
