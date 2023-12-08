const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
require("dotenv").config();
const corsMiddleware = require("./middleware/corsMiddleware");
const authRoutes = require("./routes/authRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(corsMiddleware);

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new SQLiteStore({ db: "sessions.db", concurrentDB: true }),
  })
);

app.use("/api", authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
