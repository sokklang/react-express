import React, { useState, useRef } from "react";
import axios from "axios";

const Submitreport = ({ showModal, handleClose, TaskID }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [textInput, setTextInput] = useState("");
  const fileInputRef = useRef(null);

  const onClose = () => {
    handleClose();
    setErrorMessage("");
    setSuccessMessage("");
    setFiles([]); // Clear uploaded files on modal close
    setTextInput(""); // Clear text input on modal close
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset file input value to clear previous selection
    }
  };

  // Function to handle text input change
  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  // Function to handle file upload
  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setFiles(filesArray);
    console.log("files", filesArray);
  };

  // Function to remove a file from the files array
  const handleRemoveFile = (indexToRemove) => {
    console.log("Removing file at index:", indexToRemove);
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter(
        (_, index) => index !== indexToRemove
      );
      console.log("Files after removal:", updatedFiles);
      return updatedFiles;
    });
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
              <div className="input-group">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                >
                  <i className="fa fa-file fa-fw "></i> Browse
                </button>
                <input
                  type="file"
                  id="fileInput"
                  multiple
                  className="form-control visually-hidden"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <label
                  className="input-group-text flex-grow-1"
                  htmlFor="fileInput"
                >
                  {files.length > 0
                    ? files.length === 1
                      ? files[0].name
                      : `${files.length} Files Selected`
                    : "No File Chosen"}
                </label>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              {files.map((file, index) => (
                <div key={index}>
                  <p>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm me-2"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <i className="fa fa-remove fa-fw" aria-hidden="true"></i>{" "}
                      Remove
                    </button>
                    {file.name}
                  </p>
                  {file.type.startsWith("image/") && (
                    <img
                      className="mb-3"
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      style={{ maxWidth: "100%" }}
                    />
                  )}
                  {file.type === "application/pdf" && (
                    <embed
                      className="mb-3"
                      src={URL.createObjectURL(file)}
                      type="application/pdf"
                      style={{ width: "100%", height: "calc(100vw / 1.414)" }}
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
