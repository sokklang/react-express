import React, { useState } from "react";
import axios from "axios";

const Submitreport = ({ showModal, handleClose, TaskID }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [textInput, setTextInput] = useState("");

  const onClose = () => {
    handleClose();
    setErrorMessage("");
    setSuccessMessage("");
    setFiles([]); // Clear uploaded files on modal close
    setTextInput(""); // Clear text input on modal close
  };

  // Function to handle file upload
  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setFiles(filesArray);
  };

  // Function to handle text input change
  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  // Function to submit the report
  const handleSubmit = async () => {
    try {
      // Here you can implement your submit logic, including file uploads and text input
      // For example:
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("text", textInput);
      formData.append("TaskID", TaskID);

      const response = await axios.post("/api/submitreport", formData);

      setSuccessMessage(response.data.message);
    } catch (error) {
      setErrorMessage(error.response.data.message);
    }
  };

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
              <i className="fa fa-file fa-fw me-2"></i>Task Report
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body text-start">
            {errorMessage ? (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            ) : successMessage ? (
              <div className="alert alert-success mt-3" role="alert">
                {successMessage}
              </div>
            ) : null}

            {/* Text Input Section */}
            <div className="mb-3">
              <label htmlFor="textInput" className="form-label">
                Text Report:
              </label>
              <textarea
                id="textInput"
                placeholder="Description"
                className="form-control"
                value={textInput}
                onChange={handleTextChange}
              />
            </div>

            {/* File Upload Section */}
            <div className="mb-3">
              <label htmlFor="fileInput" className="form-label">
                Upload Files:
              </label>
              <input
                type="file"
                id="fileInput"
                multiple
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            {/* Preview Section */}
            <div>
              {files.map((file, index) => (
                <div key={index}>
                  <p>{file.name}</p>
                  {file.type.startsWith("image/") && (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ maxWidth: "100%" }}
                    />
                  )}
                  {file.type === "application/pdf" && (
                    <embed
                      src={URL.createObjectURL(file)}
                      type="application/pdf"
                      style={{ width: "100%" }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submitreport;
