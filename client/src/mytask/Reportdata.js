import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const Reportdata = ({ showModal, handleClose, TaskID }) => {
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTaskDetailReport = useCallback(async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [TaskID]);

  const onClose = () => {
    handleClose();
  };

  const arrayToBlobUrl = useCallback((array, mimeType) => {
    const blob = new Blob([Uint8Array.from(array)], { type: mimeType });
    return URL.createObjectURL(blob);
  }, []);

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
        <div className="modal-content border border-info">
          <div className="modal-header border-bottom border-info ">
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
          <div className="modal-body ">
            {loading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div
                id="carouselExampleIndicators"
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {reportData.map((file, index) => (
                    <div
                      className={`carousel-item ${index === 0 ? "active" : ""}`}
                      key={index}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        {file.ReportType.startsWith("image/") && (
                          <img
                            className="mb-3"
                            src={arrayToBlobUrl(
                              file.ReportData.data,
                              file.ReportType
                            )}
                            alt={`Report ${index}`}
                            style={{
                              maxWidth: "100%",
                              maxHeight: "100%",
                              objectFit: "contain",
                            }}
                          />
                        )}
                        {file.ReportType === "application/pdf" && (
                          <embed
                            className="mb-3"
                            src={arrayToBlobUrl(
                              file.ReportData.data,
                              file.ReportType
                            )}
                            type="application/pdf"
                            style={{
                              width: "100%",
                              height: "calc(100vw / 1.414)",
                            }}
                          />
                        )}
                        {/* Add other conditions for different types of reports */}
                      </div>
                      <div className="carousel-caption">
                        <p>{file.TextData}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="prev"
                >
                  <span
                    className="carousel-control-prev-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselExampleIndicators"
                  data-bs-slide="next"
                >
                  <span
                    className="carousel-control-next-icon"
                    aria-hidden="true"
                  ></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            )}
          </div>
          <div className="modal-footer border-top border-info">
            <button
              type="button"
              className="btn btn-secondary "
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
