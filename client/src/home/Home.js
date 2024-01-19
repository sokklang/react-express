// Home.js
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const Home = () => {
  const {
    username,
    firstname,
    lastname,
    email,
    loggedIn,
    userid,
    userroletype,
    companyName,
    companyAddress,
    companyindustry,
    UserRoleId,
  } = useContext(AuthContext);

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
                  Hello, username: {username} firstname: {firstname} lastname:{" "}
                  {lastname} email : {email} ! Your UserId is {userid} and
                  RoleType is {userroletype} . Welcome back to companyname :
                  {companyName} companyAddress :{companyAddress} and
                  companyindustry {companyindustry}. UserRoleId = {UserRoleId}.
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
