// authRoutes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const companyController = require("../controllers/companyController");
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

router.delete(
  "/deleteuser/:userIdToDelete", // Add the userId parameter to the route
  middleware.checkLoggedIn,
  middleware.isAdmin,
  authController.deleteUserData
);

router.put(
  "/selfupdatedata",
  middleware.checkLoggedIn,
  authController.selfUpdateData
);

router.put(
  "/updatepassword",
  middleware.checkLoggedIn,
  authController.updatePassword
);

router.put(
  "/updateuserdata/:userIdToUpdate",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  authController.updateUserData
);

router.put(
  "/updateuserprofile",
  middleware.checkLoggedIn,
  authController.UpdateUserProfile
);

router.get(
  "/getuserprofileadmin/:userid",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  authController.GetUserProfileAdmin
);

router.get(
  "/getuserprofile",
  middleware.checkLoggedIn,
  authController.GetUserProfile
);

router.put(
  "/updatecompanylogo",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  companyController.updateCompanyLogo
);

router.get(
  "/getcompanylogo",
  middleware.checkLoggedIn,
  companyController.getCompanyLogo
);

module.exports = router;
