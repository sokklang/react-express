// authRoutes.js

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const middleware = require("../middleware/authMiddleware"); // Use a different name for the middleware module

router.post("/addtask", middleware.checkLoggedIn, taskController.addTask);
router.get("/gettask", middleware.checkLoggedIn, taskController.getTask);
router.delete(
  "/deletetask/:taskid",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.deleteTask
);

router.put(
  "/updatetask/:taskid",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.updateTask
);

router.put(
  "/approvetask/:taskid",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.approveTask
);

router.get(
  "/getapprovetask",
  middleware.checkLoggedIn,
  taskController.getApproveTask
);

router.post(
  "/assigntask",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.AssignTask
);

module.exports = router;
