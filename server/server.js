const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());

// SQLite database setup
const db = new sqlite3.Database("users.db");

// Middleware to set CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Middleware for session handling
app.use(
  session({
    secret: "your-secret-key", // Change this to a secure key
    resave: false,
    saveUninitialized: true,
  })
);

// Endpoint to register a new user
app.post("/api/register", async (req, res) => {
  // ... (unchanged)

  res.status(201).json({ message: "User registered successfully" });
});

// Endpoint to login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ?",
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

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // Store user information in the session
        req.session.user = {
          username: user.username,
          email: user.email,
        };

        res.status(200).json({
          message: "Login successful",
          username: user.username,
        });
      } else {
        res.status(401).json({ message: "Invalid username or password" });
      }
    }
  );
});

// Endpoint to check if a user is logged in
app.get("/api/check-login", (req, res) => {
  if (req.session.user) {
    res.status(200).json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// Endpoint to logout
app.post("/api/logout", (req, res) => {
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
