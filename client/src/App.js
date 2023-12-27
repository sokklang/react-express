import React from "react";
import { AuthContext } from "./AuthContext";
import { useContext } from "react";
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
import Profile from "./Profile";
import Settings from "./Settings";
import Notification from "./Notification";
import Nopage from "./Nopage";

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
        <Route path="/task" element={<Task />} />
        <Route path="/usermgmt" element={<Usermgmt />} />
        <Route path="/Approval" element={<Approval />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Settings" element={<Settings />} />
        <Route path="/Notification" element={<Notification />} />
        <Route path="*" element={<Nopage />} />
      </Routes>
    </Router>
  );
};

export default App;
