//Deleteusermodal.js

const DeleteModal = ({
  showModal,
  handleClose,
  handleDelete,
  selectDeleteId,
  selectDeleteUsername,
  errorMessage,
}) => {
  const onDelete = async () => {
    try {
      // Call handleDelete and wait for it to complete
      await handleDelete(selectDeleteId);
      // If successful, close the modal
      handleClose();
    } catch (error) {
      console.error("Delete operation failed:", error);
    }
  };

  return (
    <div
      className={`modal fade ${showModal ? "show" : ""}`}
      style={{ display: showModal ? "block" : "none" }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content text-warning border border-danger">
          <div className="modal-header border-bottom border-danger">
            <h5 className="modal-title">
              <i className="fa fa-exclamation-triangle fa-fw me-2"></i>Warning!
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body text-center">
            <p>
              Confirm Delete Username : {selectDeleteUsername} with User ID :{" "}
              {selectDeleteId} ?
            </p>

            {errorMessage ? (
              <div className="alert alert-danger mt-3" role="alert">
                {errorMessage}
              </div>
            ) : null}
          </div>
          <div className="modal-footer border-top border-danger">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="button" className="btn btn-danger" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
