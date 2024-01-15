import React, { createContext, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [userid, setUserId] = useState("");
  const [userroletype, setUserRoleType] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [companyindustry, setCompanyIndustry] = useState("");
  const [UserRoleId, setUserRoleId] = useState("");

  const handleLogin = (
    loggedInUsername,
    loggedInFirstname,
    loggedInLastname,
    loggedInEmail,
    loggedInUserId,
    loggedInUserRoleType,
    loggedInCompanyName,
    loggedInCompanyAddress,
    loggedInCompanyIndustry,
    loggedInUserRoleId
  ) => {
    setUsername(loggedInUsername);
    setFirstname(loggedInFirstname);
    setLastname(loggedInLastname);
    setEmail(loggedInEmail);
    setUserId(loggedInUserId);
    setUserRoleType(loggedInUserRoleType);
    setLoggedIn(true);
    setCompanyName(loggedInCompanyName);
    setCompanyAddress(loggedInCompanyAddress);
    setCompanyIndustry(loggedInCompanyIndustry);
    setUserRoleId(loggedInUserRoleId);
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
        setFirstname("");
        setLastname("");
        setEmail("");
        setUserId("");
        setUserRoleType("");
        setLoggedIn(false);
        setCompanyName("");
        setCompanyAddress("");
        setCompanyIndustry("");
        setUserRoleId("");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSelfUpdate = (updatedInfo) => {
    setFirstname(updatedInfo.FirstName || firstname);
    setLastname(updatedInfo.LastName || lastname);
    setEmail(updatedInfo.Email || email);
  };

  return (
    <AuthContext.Provider
      value={{
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
        handleLogin,
        handleLogout,
        handleSelfUpdate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
