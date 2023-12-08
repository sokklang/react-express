const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/check-login", authController.checkLoginStatus);
router.post("/logout", authController.logoutUser);

module.exports = router;
