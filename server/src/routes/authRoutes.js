// authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const middleware = require("../middleware/authMiddleware"); // Use a different name for the middleware module

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/check-login", authController.checkLoginStatus);
router.post("/logout", authController.logoutUser);
router.get(
  "/getuserdata",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  authController.getUserData
);

module.exports = router;
