const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.raw({ type: "image/*", limit: "10mb" }));

// SQLite database setup
const db = new sqlite3.Database("usersv1.db");

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your client's origin
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Middleware for session handling
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new SQLiteStore({ db: "sessions.db", concurrentDB: true }),
  })
);

// Endpoint to register a new user
app.post("/api/register", async (req, res) => {
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

  const hashedPassword = await bcrypt.hash(password, 10);

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
});

// Endpoint to login
app.post("/api/login", async (req, res) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  const { username, password } = req.body;

  db.get(
    "SELECT User.*, Company.CompanyName FROM User JOIN Company ON User.CompanyID = Company.CompanyID WHERE User.username = ?",
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

      const passwordMatch = await bcrypt.compare(password, user.PasswordHash);

      if (passwordMatch) {
        // Set the session variable
        req.session.user = user;

        // Generate a JWT token
        const token = jwt.sign(
          { username: user.username },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h", // Token expiration time
          }
        );

        const responseData = {
          token: token,
          username: user.username,
          companyName: user.CompanyName,
        };

        res.status(200).json(responseData);
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  );
});

// Endpoint to check if a user is logged in
app.get("/api/check-login", (req, res) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// Endpoint to logout
app.post("/api/logout", (req, res) => {
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
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
