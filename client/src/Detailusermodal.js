import React from 'react';
import "font-awesome/css/font-awesome.min.css";

const Detailusermodal = ({ showModal, handleClose, selectDetailUser }) => {
  return (
    <div
      className={`modal fade ${showModal ? 'show' : ''}`}
      style={{ display: showModal ? 'block' : 'none' }}
      data-bs-theme="dark"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title"><i className="fa fa-info fa-fw me-2"></i>User Details: {selectDetailUser.Username}</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-md-6">
                <label>User ID:</label>
                <p>{selectDetailUser.UserID}</p>
              </div>
              <div className="col-md-6">
                <label>Username:</label>
                <p>{selectDetailUser.Username}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>First Name:</label>
                <p>{selectDetailUser.FirstName}</p>
              </div>
              <div className="col-md-6">
                <label>Last Name:</label>
                <p>{selectDetailUser.LastName}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Email:</label>
                <p>{selectDetailUser.Email}</p>
              </div>
              <div className="col-md-6">
                <label>User Role:</label>
                <p>{selectDetailUser.RoleType}</p>
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-md-6">
                <label>Company:</label>
                <p>{selectDetailUser.CompanyName}</p>
              </div>
              <div className="col-md-6">
                <label>User Parent ID:</label>
                <p>{selectDetailUser.ParentUserID}</p>
              </div>
            </div>
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

export default Detailusermodal;
