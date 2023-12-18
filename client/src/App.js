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
import Nopage from "./Nopage";

const App = () => {
  const { loggedIn } = useContext(AuthContext);

  const checkCookie = (cookieName) => {
    // Split the cookie string into an array of key-value pairs
    const cookies = document.cookie.split(";");

    // Iterate over the cookies to find the one you're looking for
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();

      // Check if the cookie starts with the desired name
      if (cookie.startsWith(cookieName + "=")) {
        // Extract and return the cookie value
        return cookie.substring(cookieName.length + 1);
      }
    }

    // Return null if the cookie is not found
    return null;
  };

  // Example usage
  const myCookieValue = checkCookie("myCookie");

  if (myCookieValue) {
    console.log("Cookie value:", myCookieValue);
  } else {
    console.log("Cookie not found");
  }

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
        <Route path="*" element={<Nopage />} />
      </Routes>
    </Router>
  );
};

export default App;
