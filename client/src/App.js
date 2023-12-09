import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./Navbar";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import Task from "./Task";
import Approval from "./Approval";
import Usermgmt from "./Usermgmt";
import axios from "axios";
import Nopage from "./Nopage";

const App = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userid, setUserId] = useState("");
  const [userroletype, setUserRoleType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [UserRoleId, setUserRoleId] = useState("");

  const handleLogin = (
    loggedInUsername,
    LoggedInUserId,
    loggedInUserRoleType,
    LoggedInCompanyName,
    LoggedInUserRoleId
  ) => {
    setUsername(loggedInUsername);
    setUserId(LoggedInUserId);
    setUserRoleType(loggedInUserRoleType);
    setLoggedIn(true);
    setCompanyName(LoggedInCompanyName);
    setUserRoleId(LoggedInUserRoleId);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/logout",
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setLoggedIn(false);
        setUsername("");
        setUserId("");
        setCompanyName("");
        setUserRoleType("");
        setUserRoleId("");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Router>
      {loggedIn && (
        <Navbar
          isLoggedIn={loggedIn}
          onLogout={handleLogout}
          isUserAdmin={userroletype === "Admin User"}
        />
      )}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/login"
          element={
            loggedIn ? <Navigate to="/home" /> : <Login onLogin={handleLogin} />
          }
        />
        <Route
          path="/home"
          element={
            loggedIn ? (
              <Home
                username={username}
                loggedIn={loggedIn}
                companyName={companyName}
                onLogout={handleLogout}
                UserRoleId={UserRoleId}
                userid={userid}
                userroletype={userroletype}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/task" element={<Task loggedIn={loggedIn} />} />
        <Route path="/usermgmt" element={<Usermgmt loggedIn={loggedIn} />} />
        <Route path="/Approval" element={<Approval loggedIn={loggedIn} />} />

        <Route path="*" element={<Nopage />} />
      </Routes>
    </Router>
  );
};

export default App;
