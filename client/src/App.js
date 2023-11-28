// App.js
import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./Home";
import axios from "axios";

const App = () => {
  const [username, setUsername] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = (loggedInUsername) => {
    setUsername(loggedInUsername);
    setLoggedIn(true);
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:5000/api/logout", {}, { withCredentials: true })
      .then((response) => {
        if (response.data.success) {
          setLoggedIn(false);
          setUsername("");
        }
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <Router>
      <Routes>
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
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            loggedIn ? (
              <Home
                username={username}
                loggedIn={loggedIn}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
