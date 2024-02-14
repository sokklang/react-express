const RequestJoinModal = ({
  showModal,
  errorMessage,
  successMessage,
  handleClose,
}) => {
  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog text-white text-center" role="document">
        <div className="modal-content">
          <div
            className={`modal-header ${
              errorMessage ? "bg-danger" : "bg-success"
            }`}
          >
            <h5 className="modal-title">
              {errorMessage ? "Error" : "Success"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div
            className={`modal-body ${
              errorMessage ? "text-danger" : "text-success"
            }`}
          >
            {errorMessage || successMessage}
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
  );
};

export default RequestJoinModal;
