// authRoutes.js

const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const middleware = require("../middleware/authMiddleware"); // Use a different name for the middleware module
const taskMiddleware = require("../middleware/taskMiddleware");

router.post("/addtask", middleware.checkLoggedIn, taskController.addTask);
router.get("/gettask", middleware.checkLoggedIn, taskController.getTask);
router.delete(
  "/deletetask/:taskid",
  //taskMiddleware.isTaskClosed,
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.deleteTask
);

router.put(
  "/updatetask/:taskid",
  taskMiddleware.isTaskClosed,
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

router.get(
  "/getpendingapprovetask",
  middleware.checkLoggedIn,
  taskController.getPendingApproveTask
);

router.post(
  "/assigntask",
  taskMiddleware.isTaskClosedReqBody,
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.AssignTask
);

router.post(
  "/requestjointask/:taskid",
  taskMiddleware.isTaskClosed,
  middleware.checkLoggedIn,
  taskController.requestJoinTask
);

router.put(
  "/approverequestjoin",
  taskMiddleware.isTaskClosedReqBody,
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
  taskController.getTaskDetailReport
);

router.get(
  "/getusertaskassigned/:taskId",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.getUserTaskAssigned
);

router.get("/getmytasks", middleware.checkLoggedIn, taskController.getMyTasks);

router.put(
  "/closetaskreport/:taskid",
  taskMiddleware.isTaskClosed,
  middleware.checkLoggedIn,
  taskController.closeTaskReport
);

router.put(
  "/removerequestjointask/:taskid",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.removeRequestJoin
);

router.post(
  "/submittaskreport/:taskid",
  middleware.checkLoggedIn,
  middleware.isAdmin,
  taskController.submitTaskReport
);

router.get(
  "/gettaskdetailreport/:taskid",
  middleware.checkLoggedIn,
  taskController.getTaskDetailReport
);

module.exports = router;
