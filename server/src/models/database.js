const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("usersv1.db");

module.exports = db;
