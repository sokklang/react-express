import React from "react";
import { AuthContext } from "./context/AuthContext";

import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Login from "./Login";
import Register from "./Register";
import Home from "./home/Home";
import Task from "./task/Task";
import Approval from "./approval/Approval";
import Usermgmt from "./usermgmt/Usermgmt";
import Profile from "./profile/Profile";
import Company from "./company/Company";
import Settings from "./Settings";
import Notification from "./Notification";
import Nopage from "./Nopage";
import Assigntask from "./assigntask/Assigntask";
import Mytask from "./mytask/Mytask";
import Archivetask from "./archivetask/Archivetask";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";

const App = () => {
  const { loggedIn } = useContext(AuthContext);

  return (
    <Router>
      {loggedIn && <Navbar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={loggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/login"
          element={loggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route
          path="/home"
          element={loggedIn ? <Home /> : <Navigate to="/login" />}
        />
        <Route path="/assigntask" element={<Assigntask />} />
        <Route path="/mytask" element={<Mytask />} />
        <Route path="/task" element={<Task />} />
        <Route path="/usermgmt" element={<Usermgmt />} />
        <Route path="/Approval" element={<Approval />} />
        <Route path="/Profile" element={<Profile />} />

        <Route path="/Company" element={<Company />} />

        <Route path="/Settings" element={<Settings />} />
        <Route path="/Notification" element={<Notification />} />
        <Route path="/archivetask" element={<Archivetask />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </Router>
  );
};

export default App;
