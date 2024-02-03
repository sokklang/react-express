const db = require("../models/database");

async function addTask(req, res) {
  try {
    const userroleid = req.session.user.UserRoleId;

    const userrole = req.session.user.RoleType;
    const userid = req.session.user.UserID;
    const companyid = req.session.user.CompanyID;
    let approvalTimestamp = new Date().toLocaleString();

    const {
      TaskTitle,
      TaskDescription,
      TaskDeadline,
      PriorityID,
      TaskTypeID,
      DependentTaskID,
    } = req.body;

    if (!TaskTitle.trim() || !TaskDescription.trim() || !TaskDeadline.trim()) {
      return res.status(400).json({ error: "All Field cant be empty" });
    }

    let approvalStatus, approverUserID, status;

    if (userrole === "Admin User") {
      // Admin user logic
      approvalStatus = "Approved";
      approverUserID = userid;
      status = "Starting";
    } else {
      // Non-admin user logic
      approvalStatus = "Pending";
      approverUserID = null;
      status = "Waiting";
      approvalTimestamp = null; // Set ApprovalTimestamp to null
    }

    const sql = `
      INSERT INTO Task (
        TaskTitle,
        TaskDescription,
        TaskDeadline,
        PriorityID,
        CompanyID,
        TaskTypeID,
        UserID,
        UserRoleID,
        ApprovalStatus,
        ApprovalTimestamp,
        ApproverUserID,
        Status,
        DependentTaskID
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      TaskTitle,
      TaskDescription,
      TaskDeadline,
      PriorityID,
      companyid,
      TaskTypeID,
      userid,
      userroleid,
      approvalStatus,
      approvalTimestamp,
      approverUserID,
      status,
      DependentTaskID,
    ];

    db.run(sql, params, function (err) {
      if (err) {
        console.error("Error adding task:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const taskId = this.lastID; // Get the ID of the last inserted row
      console.log("Task added successfully with ID:", taskId);

      // Send the newly created task ID as a response
      res.status(201).json({ taskId, message: "Task added successfully" });
    });
  } catch (error) {
    console.error("Error adding task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getTask(req, res) {
  try {
    const companyID = req.session.user.CompanyID;

    const query = `
      SELECT * FROM Task
      WHERE CompanyID = ?
    `;

    db.all(query, [companyID], (err, rows) => {
      if (err) {
        console.error("Error fetching tasks:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Map the fetched data into the desired format
      const taskData = rows.map((task) => ({
        TaskID: task.TaskID,
        TaskTitle: task.TaskTitle,
        TaskDescription: task.TaskDescription,
        TaskDeadline: task.TaskDeadline,
        PriorityID: task.PriorityID,
        CompanyID: task.CompanyID,
        TaskTypeID: task.TaskTypeID,
        UserID: task.UserID,
        UserRoleID: task.UserRoleID,
        TaskCreationDate: task.TaskCreationDate,
        ApprovalStatus: task.ApprovalStatus,
        ApprovalTimestamp: task.ApprovalTimestamp,
        ApproverUserID: task.ApproverUserID,
        Status: task.Status,
        DependentTaskID: task.DependentTaskID,
      }));

      // Send the mapped data as a response
      res.status(200).json({ tasks: taskData });
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function updateTask(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  const { taskid } = req.params;
  const userrole = req.session.user.RoleType;
  console.log(taskid);
  const {
    TaskDescription,
    TaskDeadline,
    PriorityID,
    TaskTypeID,
    DependentTaskID,
  } = req.body;

  if (userrole === "Admin User") {
    db.run("PRAGMA foreign_keys = '0';");

    db.run(
      "UPDATE Task SET TaskDescription=?, TaskDeadline=?, PriorityID=?, TaskTypeID=?, DependentTaskID=? WHERE TaskID=?",
      [
        TaskDescription,
        TaskDeadline, // Assuming TaskDeadline is the correct column here
        PriorityID,
        TaskTypeID,
        DependentTaskID,
        taskid,
      ],
      (updateErr) => {
        // Re-enable foreign key constraints
        db.run("PRAGMA foreign_keys = '1';");

        if (updateErr) {
          console.error("Error updating Task information:", updateErr.message);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        db.run("PRAGMA foreign_keys = '1';");

        res.status(200).json({ message: "Task Update successfully" });
      }
    );
  } else {
    res.status(403).json({ error: "Access forbidden" });
  }
}

async function deleteTask(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  const { taskid } = req.params;
  const userrole = req.session.user.RoleType;

  if (userrole === "Admin User") {
    db.run("PRAGMA foreign_keys = '0';");
    db.run("DELETE FROM Task WHERE TaskID = ?", [taskid], function (error) {
      // Re-enable foreign key constraints
      db.run("PRAGMA foreign_keys = '1';");

      if (error) {
        console.error("Error deleting Task:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      db.run("PRAGMA foreign_keys = '1';");

      res.status(200).json({ message: "Task deleted successfully" });
    });
  } else {
    res.status(403).json({ error: "Access forbidden" });
  }
}

async function approveTask(req, res) {}

async function closeTaskReport(req, res) {}

async function AssignTask(req, res) {}

async function notifyTask(req, res) {}

module.exports = {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  approveTask,
  closeTaskReport,
  AssignTask,
  notifyTask,
};
