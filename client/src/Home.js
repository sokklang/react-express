// Home.js
import { Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const Home = ({ username, loggedIn }) => {
  const userid = localStorage.getItem("userid");
  const userroletype = localStorage.getItem("userroletype");
  const companyName = localStorage.getItem("companyName");
  const UserRoleId = localStorage.getItem("UserRoleId");

  if (!loggedIn) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  return (
    <div>
      {/* Main Content */}
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header bg-primary text-white">
                Welcome, {username}!
              </div>
              <div className="card-body">
                <p className="card-text">
                  Hello, {username}! Your UserId is {userid} and RoleType is{" "}
                  {userroletype} . Welcome back to {companyName}. UserRoleId ={" "}
                  {UserRoleId}.
                </p>
                {/* You can add the content of your home page here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
