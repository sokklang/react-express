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

router.post(
  "/requestjointask/:taskId",
  middleware.checkLoggedIn,
  taskController.requestJoinTask
);

router.put(
  "/approverequestjoin",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.approveRequestJoin
);

router.get(
  "/getallrequestjoin",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.getAllRequestJoin
);

router.get(
  "/gettaskdetail/:taskId",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.getTaskDetail
);

router.get(
  "/getusertaskassigned/:taskId",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.getUserTaskAssigned
);

module.exports = router;
