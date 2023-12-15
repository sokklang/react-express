import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
        setUsername("");
        setUserId("");
        setUserRoleType("");
        setLoggedIn(false);
        setCompanyName("");
        setUserRoleId("");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        loggedIn,
        userid,
        userroletype,
        companyName,
        UserRoleId,
        handleLogin,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
