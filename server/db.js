// database.js
const sqlite3 = require("sqlite3").verbose();

// Create a new SQLite database in memory
const db = new sqlite3.Database("users.db");

// Create a table for users
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password VARCHAR,
    email TEXT
  )
`);

// Function to add a new user
function addUser(username, password, email) {
  db.run(
    "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
    username,
    password,
    email
  );
}

// Example: Adding a user

// Function to retrieve all users
function getAllUsers(callback) {
  db.all("SELECT * FROM users", callback);
}

// Example: Retrieving all users
getAllUsers((err, users) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("All Users:", users);
  }

  // Close the database connection
  db.close();
});
