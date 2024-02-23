//server.js

const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
require("dotenv").config();
const corsMiddleware = require("./middleware/corsMiddleware");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.raw({ type: "application/octet-stream", limit: "50mb" }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(corsMiddleware);

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new SQLiteStore({ db: "sessions.db", concurrentDB: true }),
  })
);

app.use("/api", authRoutes, taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
