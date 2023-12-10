const db = require("../models/database");
const bcryptUtils = require("../models/bcryptUtils");
const jwtUtils = require("../utils/jwtUtils");

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
              return res.status(500).json({ error: "Internal Server Error" });
            }

            companyId = this.lastID; // Get the ID of the newly inserted company

            // Insert the new user as an admin user for the newly created company
            db.run(
              "INSERT INTO User (Username, FirstName, LastName, Email, PasswordHash, UserRoleId, CompanyID, RoleType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
              [
                username,
                firstname,
                lastname,
                email,
                hashedPassword,
                2,
                companyId,
                "Admin User",
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
          "INSERT INTO User (Username, FirstName, LastName, Email, PasswordHash, UserRoleId, CompanyID, RoleType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            username,
            firstname,
            lastname,
            email,
            hashedPassword,
            1,
            companyId,
            "Standard User",
          ],
          function (userInsertError) {
            if (userInsertError) {
              console.error(userInsertError);
              return res.status(500).json({ error: "Internal Server Error" });
            }

            return res.status(200).json({ message: "Registration successful" });
          }
        );
      }
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

      if (passwordMatch) {
        // Set the session variable
        req.session.user = user;

        // Generate a JWT token
        const token = jwtUtils.generateToken(
          {
            username: user.username,
            userid: user.UserID,
            companyName: user.CompanyName,
            UserRoleId: user.UserRoleId,
            userroletype: user.RoleType,
          },

          process.env.JWT_SECRET,
          {
            expiresIn: "1h", // Token expiration time
          }
        );

        const responseData = {
          token: token,
          userid: user.UserID,
          companyName: user.CompanyName,
          username: user.username,
          UserRoleId: user.UserRoleId,
          userroletype: user.RoleType,
        };

        res.status(200).json(responseData);
      } else {
        res.status(401).json({ message: "Invalid username or password" });
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
          Username: user.username,
          FirstName: user.FirstName,
          LastName: user.LastName,
          Email: user.Email,
          UserRoleId: user.UserRoleId,
          CompanyName: user.CompanyName,
          CompanyID: user.CompanyID,
          ParentUserID: user.ParentUserID,
          RoleType: user.RoleType,
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

module.exports = {
  registerUser,
  loginUser,
  checkLoginStatus,
  logoutUser,
  getUserData,
};
