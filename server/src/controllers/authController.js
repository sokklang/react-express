const db = require("../models/database");
const bcryptUtils = require("../models/bcryptUtils");
const sqlite3 = require("sqlite3").verbose();
const sessionDB = new sqlite3.Database("sessions.db");
//const jwtUtils = require("../utils/jwtUtils");

async function registerUser(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  const {
    username,
    firstname,
    lastname,
    password,
    email,
    companyname,
    companyaddress,
    industry,
  } = req.body;

  const hashedPassword = await bcryptUtils.hashPassword(password);

  // Check if the username already exists
  db.get(
    "SELECT * FROM User WHERE Username = ?",
    [username],
    async (userError, existingUser) => {
      if (userError) {
        console.error(userError);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (existingUser) {
        console.error("Username already exists");
        return res.status(400).json({ error: "Username already exists" });
      }

      // Check if the company already exists
      db.get(
        "SELECT * FROM Company WHERE CompanyName = ?",
        [companyname],
        (companyError, existingCompany) => {
          if (companyError) {
            console.error(companyError);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          let companyId;

          if (!existingCompany) {
            // Insert the new company into the Company table
            db.run(
              "INSERT INTO Company (CompanyName, Address, Industry) VALUES (?, ?, ?)",
              [companyname, companyaddress, industry],
              function (companyInsertError) {
                if (companyInsertError) {
                  console.error(companyInsertError);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                companyId = this.lastID; // Get the ID of the newly inserted company

                // Insert the new user as an admin user for the newly created company
                db.run(
                  "INSERT INTO User (Username, FirstName, LastName, Email, PasswordHash, UserRoleId, CompanyID, RoleType, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                  [
                    username,
                    firstname,
                    lastname,
                    email,
                    hashedPassword,
                    2,
                    companyId,
                    "Admin User",
                    1,
                  ],
                  function (userInsertError) {
                    if (userInsertError) {
                      console.error(userInsertError);
                      return res
                        .status(500)
                        .json({ error: "Internal Server Error" });
                    }

                    const userId = this.lastID; // Get the ID of the newly inserted user

                    // Insert the new admin user into the AdminCompany table
                    db.run(
                      "INSERT INTO AdminCompany (UserID, CompanyID) VALUES (?, ?)",
                      [userId, companyId],
                      function (adminInsertError) {
                        if (adminInsertError) {
                          console.error(adminInsertError);
                          return res
                            .status(500)
                            .json({ error: "Internal Server Error" });
                        }

                        return res
                          .status(200)
                          .json({ message: "Registration successful" });
                      }
                    );
                  }
                );
              }
            );
          } else {
            companyId = existingCompany.CompanyID;

            // Insert the new user as a standard user for an existing company
            db.run(
              "INSERT INTO User (Username, FirstName, LastName, Email, PasswordHash, UserRoleId, CompanyID, RoleType, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
              [
                username,
                firstname,
                lastname,
                email,
                hashedPassword,
                1,
                companyId,
                "Standard User",
                0,
              ],
              function (userInsertError) {
                if (userInsertError) {
                  console.error(userInsertError);
                  return res
                    .status(500)
                    .json({ error: "Internal Server Error" });
                }

                return res
                  .status(200)
                  .json({ message: "Registration successful" });
              }
            );
          }
        }
      );
    }
  );
}

async function loginUser(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  const { username, password } = req.body;

  db.get(
    "SELECT User.*, Company.* FROM User JOIN Company ON User.CompanyID = Company.CompanyID WHERE User.username = ?",
    [username],
    async (err, user) => {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }

      const passwordMatch = await bcryptUtils.comparePasswords(
        password,
        user.PasswordHash
      );

      console.log("passwordMatch:", passwordMatch);
      console.log("IsActive:", user.IsActive);

      if (passwordMatch && user.IsActive === 1) {
        // Set the session variable
        req.session.user = user;

        const responseData = {
          userid: user.UserID,
          username: user.Username,
          firstname: user.FirstName,
          lastname: user.LastName,
          userroleid: user.UserRoleId,
          userroletype: user.RoleType,
          email: user.Email,
          companyaddress: user.Address,
          companyindustry: user.Industry,
          companyname: user.CompanyName,
          companyid: user.CompanyID,
        };

        return res.status(200).json(responseData);
      } else if (passwordMatch && user.IsActive === 0) {
        return res.status(403).json({
          message: `Account is disabled! Please contact ${user.CompanyName} Administrator`,
        });
      } else {
        return res
          .status(401)
          .json({ message: "Invalid username or password" });
      }
    }
  );
}

function checkLoginStatus(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
}

function logoutUser(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ success: false });
    } else {
      res.json({ success: true });
    }
  });
}

async function getUserData(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  const requestingUserRole = req.session.user.RoleType; // Assuming you have the role in the session
  const requestingUserId = req.session.user.UserID; // Assuming user data is stored in the session

  // Check if the requesting user is an admin
  if (requestingUserRole === "Admin User") {
    // Fetch user data for all users within the same company as the admin
    db.all(
      "SELECT User.*, Company.CompanyName FROM User JOIN Company ON User.CompanyID = Company.CompanyID WHERE User.CompanyID = (SELECT CompanyID FROM User WHERE UserID = ?);",
      [requestingUserId],
      (error, usersData) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        // Omit sensitive information like password hash before sending the response
        const sanitizedUsersData = usersData.map((user) => ({
          UserID: user.UserID,
          Username: user.Username,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          UserRoleId: user.UserRoleId,
          CompanyName: user.CompanyName,
          CompanyID: user.CompanyID,
          ParentUserID: user.ParentUserID,
          RoleType: user.RoleType,
          IsActive: user.IsActive,
          // Add other fields as needed
        }));

        res.status(200).json(sanitizedUsersData);
      }
    );
  } else {
    // If not an admin, deny access
    res.status(403).json({ error: "Access forbidden" });
  }
}

async function selfUpdateData(req, res) {
  const selfIdToUpdate = req.session.user.UserID;
  console.log(selfIdToUpdate);

  // Extract and validate update data from the request body
  const { FirstName, LastName, Email } = req.body;

  if (!FirstName || !LastName || !Email) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.run(
    "UPDATE User SET FirstName=?, LastName=?, Email=? WHERE UserID=?",
    [FirstName, LastName, Email, selfIdToUpdate],
    (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ message: "Internal Server Error" });
      }

      // Update the user information in the session
      req.session.user.FirstName = FirstName;
      req.session.user.LastName = LastName;
      req.session.user.Email = Email;

      return res.json({ message: "User information updated successfully" });
    }
  );
}

async function updatePassword(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);

  const { password } = req.body;
  const userpasswordupdateid = req.session.user.UserID;
  if (!password.trim()) {
    return res.status(400).json({ message: "Password cannot be empty" });
  }
  const hashedPassword = await bcryptUtils.hashPassword(password);

  db.run(
    "UPDATE User SET PasswordHash=? WHERE UserID=?",
    [hashedPassword, userpasswordupdateid],
    (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ message: "Internal Server Error" });
      }

      return res.json({ message: "User Password updated successfully" });
    }
  );
}

async function ResetPassword(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  const requestingUserRole = req.session.user.RoleType;

  const { password } = req.body;
  const passwordresetuserid = req.params.passwordresetuserid;

  // Check if the password is an empty string
  if (!password.trim()) {
    return res.status(400).json({ error: "Password cannot be empty" });
  }

  const hashedPassword = await bcryptUtils.hashPassword(password);

  if (requestingUserRole === "Admin User") {
    db.run(
      "UPDATE User SET PasswordHash=? WHERE UserID=?",
      [hashedPassword, passwordresetuserid],
      (updateErr) => {
        if (updateErr) {
          return res.status(500).json({ error: "Internal Server Error" });
        }

        return res.json({ message: "User Password updated successfully" });
      }
    );
  } else {
    res.status(403).json({ error: "Access forbidden" });
  }
}

async function deleteUserData(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  const { userIdToDelete } = req.params;
  const loggedInUserId = req.session.user.UserID;

  // Check if the user to be deleted is the same as the logged-in user
  if (parseInt(userIdToDelete, 10) === loggedInUserId) {
    return res
      .status(403)
      .json({ error: "User cannot delete their own account" });
  }

  db.get(
    "SELECT RoleType FROM User WHERE UserID = ?",
    [userIdToDelete],
    function (error, row) {
      if (error) {
        console.error("Error checking user role:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!row) {
        return res.status(404).json({ error: "User not found" });
      }

      const userRoleType = row.RoleType;

      if (userRoleType === "Admin User") {
        return res.status(403).json({ error: "Cannot delete admin account" });
      }

      // Disable foreign key constraints
      db.run("PRAGMA foreign_keys = '0';");

      // Proceed with the deletion
      db.run(
        "DELETE FROM User WHERE UserID = ?",
        [userIdToDelete],
        function (error) {
          // Re-enable foreign key constraints
          db.run("PRAGMA foreign_keys = '1';");

          if (error) {
            console.error("Error deleting user:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: "User not found" });
          }

          db.run("PRAGMA foreign_keys = '1';");

          const userIdToDeleteInt = parseInt(userIdToDelete, 10);

          sessionDB.run(
            `DELETE FROM sessions WHERE json_extract(sess, '$.user.UserID') = ?`,
            [userIdToDeleteInt],
            function (err) {
              if (err) {
                return console.error(err.message);
              }

              console.log(`Row(s) deleted ${this.changes}`);
            }
          );

          res.status(200).json({ message: "User deleted successfully" });
        }
      );
    }
  );
}

async function updateUserData(req, res) {
  const requestingUserRole = req.session.user.RoleType;
  const userIdToUpdate = req.params.userIdToUpdate;

  console.log("Requesting user role:", requestingUserRole);
  console.log("User to update:", userIdToUpdate);

  // Fetch user data for the specified user
  db.get(
    "SELECT * FROM User WHERE UserID = ?",
    [userIdToUpdate],
    (err, user) => {
      if (err) {
        console.error("Error fetching user data:", err.message);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Extract and validate update data from the request body
      const { FirstName, LastName, Email, RoleType, IsActive } = req.body;

      //console.log("User data to update:", user);
      console.log("Update data:", {
        FirstName,
        LastName,
        Email,
        RoleType,
        IsActive,
      });

      if (!FirstName || !LastName || !Email || !RoleType) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Map RoleType to RoleId
      const roleId = RoleType === "Admin User" ? 2 : 1;

      // Disable foreign key constraints
      db.run("PRAGMA foreign_keys = '0';");

      // Update the user information in the database
      db.run(
        "UPDATE User SET FirstName=?, LastName=?, Email=?, UserRoleId=?, RoleType=?, IsActive=? WHERE UserID=?",
        [
          FirstName,
          LastName,
          Email,
          roleId,
          RoleType,
          IsActive,
          userIdToUpdate,
        ],
        (updateErr) => {
          // Re-enable foreign key constraints
          db.run("PRAGMA foreign_keys = '1';");

          if (updateErr) {
            console.error(
              "Error updating user information:",
              updateErr.message
            );
            return res.status(500).json({ message: "Internal Server Error" });
          }

          res.json({ message: "User information updated successfully" });
        }
      );
    }
  );
  const userIdToDeleteInt = parseInt(userIdToUpdate, 10);

  sessionDB.run(
    `DELETE FROM sessions WHERE json_extract(sess, '$.user.UserID') = ?`,
    [userIdToDeleteInt],
    function (err) {
      if (err) {
        return console.error(err.message);
      }

      console.log(`Row(s) deleted ${this.changes}`);
    }
  );
}

async function GetUserProfile(req, res) {
  try {
    console.log(`Received ${req.method} request for ${req.url}`);
    const userId = req.session.user.UserID;

    // Using Promises with SQLite3
    const userProfileImageResult = await new Promise((resolve, reject) => {
      db.get(
        "SELECT ImageData FROM ImageProfile WHERE UserID = ?",
        [userId],
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    if (!userProfileImageResult) {
      return res.status(404).json({ error: "User profile image not found" });
    }

    console.log(userProfileImageResult.ImageData.length);

    // Send the ArrayBuffer as the response
    res.status(200).send(userProfileImageResult.ImageData);
  } catch (error) {
    console.error("Error in GetUserProfile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function GetUserProfileAdmin(req, res) {
  try {
    console.log(`Received ${req.method} request for ${req.url}`);
    const requestingUserRole = req.session.user.RoleType; // Assuming you have the role in the session

    const userid = req.params.userid;

    // Check if the requesting user is an admin
    if (requestingUserRole === "Admin User") {
      const userProfileImageResult = await new Promise((resolve, reject) => {
        db.get(
          "SELECT ImageData FROM ImageProfile WHERE UserID = ?",
          [userid],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (!userProfileImageResult) {
        return res.status(404).json({ error: "User profile image not found" });
      }

      // Send the image data for admin users
      res.status(200).send(userProfileImageResult.ImageData);
    } else {
      // Handle the case where the requesting user is not an admin
      res.status(403).json({ error: "Permission denied" });
    }
  } catch (error) {
    console.error("Error in GetUserProfile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function UpdateUserProfile(req, res) {
  try {
    console.log(`Received ${req.method} request for ${req.url}`);
    const userId = req.session.user.UserID;

    // Access the binary data from the request body
    const imageData = req.body;
    console.log("Received image data:", imageData);

    // Convert the ArrayBuffer to a Buffer
    const buffer = Buffer.from(imageData);
    console.log("buffer", buffer);

    // Your database logic here
    db.run(
      "INSERT OR REPLACE INTO ImageProfile (UserID, ImageData) VALUES (?, ?)",
      [userId, buffer]
    );

    res.status(200).json({ message: "Image profile updated successfully" });
  } catch (error) {
    console.error("Error in UpdateUserProfile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function GetUserProfileAdminCompany(req, res) {
  try {
    console.log(`Received ${req.method} request for ${req.url}`);
    const requestingUserRole = req.session.user.RoleType; // Assuming you have the role in the session
    const companyId = req.session.user.CompanyID;

    // Check if the requesting user is an admin
    if (requestingUserRole === "Admin User") {
      const userProfilesResult = await new Promise((resolve, reject) => {
        db.all(
          "SELECT u.UserID, u.Username, i.ImageData FROM User u LEFT JOIN ImageProfile i ON u.UserID = i.UserID WHERE u.CompanyID = ?",
          [companyId],
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (!userProfilesResult || userProfilesResult.length === 0) {
        return res
          .status(404)
          .json({ error: "No user profiles found for the company" });
      }

      // Send the user profiles for admin users
      res.status(200).json(userProfilesResult);
    } else {
      // Handle the case where the requesting user is not an admin
      res.status(403).json({ error: "Permission denied" });
    }
  } catch (error) {
    console.error("Error in GetUserProfile:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  checkLoginStatus,
  logoutUser,
  getUserData,
  ResetPassword,
  deleteUserData,
  selfUpdateData,
  updatePassword,
  updateUserData,
  GetUserProfile,
  GetUserProfileAdmin,
  UpdateUserProfile,
  GetUserProfileAdminCompany,
};
