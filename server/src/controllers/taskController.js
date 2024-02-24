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
  //console.log(taskid);
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
  try {
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
  } catch (error) {
    console.error("Error adding task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function approveTask(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  try {
    const userrole = req.session.user.RoleType;
    const ApproverUserID = req.session.user.UserID;

    const { taskid } = req.params;

    let approvalTimestamp = new Date().toLocaleString();

    if (userrole === "Admin User") {
      db.run("PRAGMA foreign_keys = '0';");
      db.run(
        "UPDATE Task SET ApprovalStatus=?, ApproverUserID=?, ApprovalTimestamp=?, Status=? WHERE TaskID=?",
        [
          "Approved",
          ApproverUserID, // Assuming TaskDeadline is the correct column here
          approvalTimestamp,
          "Starting",
          taskid,
        ],
        (updateErr) => {
          // Re-enable foreign key constraints
          db.run("PRAGMA foreign_keys = '1';");

          if (updateErr) {
            console.error("Error Approving:", updateErr.message);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          db.run("PRAGMA foreign_keys = '1';");

          res.status(200).json({ message: "Task Approved successfully" });
        }
      );
    } else {
      res.status(403).json({ error: "Access forbidden" });
    }
  } catch (error) {
    console.error("Error adding task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getApproveTask(req, res) {
  try {
    const companyID = req.session.user.CompanyID;

    const query = `
      SELECT * FROM Task
      WHERE CompanyID = ? AND ApprovalStatus = 'Approved'
    `;

    // Using a Promise to make the asynchronous call
    const getApprovedTasks = () => {
      return new Promise((resolve, reject) => {
        db.all(query, [companyID], (err, rows) => {
          if (err) {
            reject(err);
          } else {
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
            resolve(taskData);
          }
        });
      });
    };

    // Await the Promise and send the mapped data as a response
    const approvedTasks = await getApprovedTasks();
    res.status(200).json({ approvedTasks });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getPendingApproveTask(req, res) {
  try {
    const companyID = req.session.user.CompanyID;

    const query = `
      SELECT * FROM Task
      WHERE CompanyID = ? AND ApprovalStatus = 'Pending'
    `;

    // Using a Promise to make the asynchronous call
    const getPendingApprovedTasks = () => {
      return new Promise((resolve, reject) => {
        db.all(query, [companyID], (err, rows) => {
          if (err) {
            reject(err);
          } else {
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
            resolve(taskData);
          }
        });
      });
    };

    // Await the Promise and send the mapped data as a response
    const pendingApprovedTasks = await getPendingApprovedTasks();
    res.status(200).json({ pendingApprovedTasks });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function AssignTask(req, res) {
  try {
    const { taskId, assignedUserIds } = req.body;

    if (!taskId || !assignedUserIds || !Array.isArray(assignedUserIds)) {
      return res.status(400).json({
        error: "Task ID and an array of assigned user IDs are required.",
      });
    }

    // Disable foreign key constraints
    await new Promise((resolve, reject) => {
      db.run("PRAGMA foreign_keys = '0';", function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Convert array of assigned user IDs to a string
    const assignedUserIdsString = JSON.stringify(assignedUserIds);

    // Check if a record already exists for this TaskID
    const existingRecord = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM TaskAssignment WHERE TaskID = ?",
        [taskId],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    // If a record already exists, update it; otherwise, insert a new record
    if (existingRecord) {
      await new Promise((resolve, reject) => {
        db.run(
          "UPDATE TaskAssignment SET AssignedUserID = ? WHERE TaskID = ?",
          [assignedUserIdsString, taskId],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    } else {
      await new Promise((resolve, reject) => {
        db.run(
          "INSERT INTO TaskAssignment (TaskID, AssignedUserID) VALUES (?, ?)",
          [taskId, assignedUserIdsString],
          function (err) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          }
        );
      });
    }

    // Re-enable foreign key constraints
    await new Promise((resolve, reject) => {
      db.run("PRAGMA foreign_keys = '1';", function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    res.status(200).json({
      message: `Task assigned successfully to ${assignedUserIds.length} users.`,
    });
  } catch (error) {
    console.error("Error assigning task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function requestJoinTask(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);

  try {
    const { taskid } = req.params;
    const userId = req.session.user.UserID;

    if (!taskid || !userId) {
      return res.status(400).json({
        error: "Task ID and user ID are required.",
      });
    }

    // Retrieve the existing TaskAssignment record for the given task
    const existingAssignment = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM TaskAssignment WHERE TaskID = ?",
        [taskid],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    if (!existingAssignment) {
      return res.status(404).json({
        error: "Task assignment not found.",
      });
    }

    // Parse the existing RequestJoinUserID as an array
    let requestJoinUserIds = JSON.parse(
      existingAssignment.RequestJoinUserID || "[]"
    );

    // Check if the user has already requested to join
    if (requestJoinUserIds.includes(userId)) {
      return res.status(400).json({
        error: "User has already requested to join this task.",
      });
    }

    // Parse the existing AssignedUserID as an array
    let assignedUserIds = JSON.parse(existingAssignment.AssignedUserID || "[]");

    // Check if the user is already assigned to the task
    if (assignedUserIds.includes(userId)) {
      return res.status(400).json({
        error: "User is already assigned to this task.",
      });
    }

    // Add the user ID to the array of requested join users
    requestJoinUserIds.push(userId);

    // Update the TaskAssignment record with the updated RequestJoinUserID
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE TaskAssignment SET RequestJoinUserID = ? WHERE TaskID = ?",
        [JSON.stringify(requestJoinUserIds), taskid],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    res.status(200).json({
      message: "Request to join task sent successfully.",
    });
  } catch (error) {
    console.error("Error requesting to join task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function approveRequestJoin(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);

  try {
    const { taskId, userIds } = req.body;
    console.log("taskid", taskId);
    console.log("userid", userIds);

    if (!taskId || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        error: "Task ID and an array of user IDs are required.",
      });
    }

    // Retrieve the TaskAssignment record for the given task
    const taskAssignment = await new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM TaskAssignment WHERE TaskID = ?",
        [taskId],
        function (err, row) {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    if (!taskAssignment) {
      return res.status(404).json({
        error: "Task assignment not found.",
      });
    }

    // Parse the RequestJoinUserID and AssignedUserID as arrays
    let requestJoinUserIds = JSON.parse(
      taskAssignment.RequestJoinUserID || "[]"
    );
    let assignedUserIds = JSON.parse(taskAssignment.AssignedUserID || "[]");

    // Remove common elements from RequestJoinUserID and AssignedUserID
    requestJoinUserIds = requestJoinUserIds.filter(
      (id) => !userIds.includes(id)
    );
    assignedUserIds = assignedUserIds.filter((id) => !userIds.includes(id));

    // Update the TaskAssignment record with the updated RequestJoinUserID and AssignedUserID
    await new Promise((resolve, reject) => {
      db.run(
        "UPDATE TaskAssignment SET RequestJoinUserID = ?, AssignedUserID = ? WHERE TaskID = ?",
        [
          JSON.stringify(requestJoinUserIds),
          JSON.stringify([...assignedUserIds, ...userIds]),
          taskId,
        ],
        function (err) {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    res.status(200).json({
      message: "Requests to join task approved successfully.",
    });
  } catch (error) {
    console.error("Error approving requests to join task:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getAllRequestJoin(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);

  try {
    // Query TaskAssignment records where RequestJoinUserID is not null and not an empty array
    const taskAssignments = await new Promise((resolve, reject) => {
      db.all(
        `SELECT TaskAssignment.*, Task.TaskID, Task.TaskTitle, Task.TaskDescription, Task.TaskDeadline, Task.PriorityID, Task.CompanyID, Task.TaskTypeID, Task.UserID, Task.UserRoleID, Task.TaskCreationDate, Task.ApprovalStatus, Task.ApprovalTimestamp, Task.ApproverUserID, Task.Status, Task.DependentTaskID 
         FROM TaskAssignment 
         JOIN Task ON TaskAssignment.TaskID = Task.TaskID 
         WHERE TaskAssignment.RequestJoinUserID IS NOT NULL AND TaskAssignment.RequestJoinUserID != '[]'`,
        function (err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });

    // If no task assignments with pending join requests are found, return an empty response
    if (!taskAssignments || taskAssignments.length === 0) {
      return res.status(404).json({
        message: "No pending join requests found.",
      });
    }

    // Return the task assignments with pending join requests
    res.status(200).json({
      message: "Pending join requests found.",
      taskAssignments: taskAssignments,
    });
  } catch (error) {
    console.error("Error retrieving pending join requests:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getUserTaskAssigned(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  try {
    const taskId = req.params.taskId;

    if (!taskId) {
      return res.status(400).json({
        error: "Task ID is required.",
      });
    }

    const query = `
      SELECT AssignedUserID
      FROM TaskAssignment
      WHERE TaskID = ?;
    `;

    db.get(query, [taskId], (err, row) => {
      if (err) {
        console.error("Error fetching assigned users for task:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      if (!row) {
        return res.status(404).json({ error: "Task not found." });
      }

      const assignedUserIds = row.AssignedUserID;
      res.status(200).json({ assignedUserIds });
    });
  } catch (error) {
    console.error("Error in getUserTaskAssigned:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

const removeRequestJoin = async (req, res) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  try {
    const taskid = req.params.taskid; // Ensure the parameter name matches the route parameter
    //console.log(taskid); // Log taskId to verify it's received correctly
    // Update TaskAssignment table to set RequestJoinUserID to an empty array
    const updateQuery = `UPDATE TaskAssignment SET RequestJoinUserID = '[]' WHERE TaskID = ?`;
    db.run(updateQuery, [taskid], function (err) {
      if (err) {
        console.error("Error updating TaskAssignment table:", err.message);
        return res.status(500).json({ error: "Internal server error" });
      } else {
        console.log(`Request join removed successfully for task ${taskid}`);
        return res
          .status(200)
          .json({ message: "Request join removed successfully" });
      }
    });
  } catch (error) {
    console.error("Error in removeRequestJoin function:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

async function getMyTasks(req, res) {
  try {
    console.log(`Received ${req.method} request for ${req.url}`);

    // Extract user ID from session
    const userId = req.session.user.UserID;
    //console.log(`User ID extracted from session: ${userId}`);

    // Query to retrieve all task assignments
    const assignmentQuery = `
      SELECT * 
      FROM TaskAssignment 
    `;

    // Execute the query to retrieve all task assignments
    db.all(assignmentQuery, [], (err, taskAssignments) => {
      if (err) {
        console.error("Error fetching task assignments:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      //console.log("Task assignments fetched:", taskAssignments);

      // Filter task assignments based on the user ID
      const filteredAssignments = taskAssignments.filter((taskAssignment) => {
        // Parse AssignedUserID as an array
        const assignedUserIds = JSON.parse(taskAssignment.AssignedUserID);
        // Check if userId exists in the assignedUserIds array
        return assignedUserIds.includes(userId);
      });

      //console.log("Filtered task assignments:", filteredAssignments);

      // Extract TaskIDs from filtered task assignments
      const taskIDs = filteredAssignments.map(
        (taskAssignment) => taskAssignment.TaskID
      );

      //console.log("Task IDs:", taskIDs);

      // Query to retrieve tasks associated with the TaskIDs
      const taskQuery = `
        SELECT Task.*, TaskAssignment.AssignedUserID
        FROM Task
        JOIN TaskAssignment ON Task.TaskID = TaskAssignment.TaskID
        WHERE Task.TaskID IN (${taskIDs.join(",")})
      `;

      // Execute the query to retrieve tasks associated with the user ID
      db.all(taskQuery, [], (err, tasks) => {
        if (err) {
          console.error("Error fetching tasks:", err.message);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          //console.log("Tasks fetched:", tasks);
          // Send the retrieved tasks as JSON response
          res.json(tasks);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function closeTaskReport(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  try {
    const taskid = req.params.taskid;

    // Fetch task details from the database
    db.get(
      "SELECT TaskDeadline, Status FROM Task WHERE TaskID = ?",
      [taskid],
      async function (err, row) {
        if (err) {
          throw new Error("Error fetching task details: " + err.message);
        }

        if (!row) {
          res.status(404).json({ error: "Task not found" });
          return;
        }

        const taskDeadline = new Date(row.TaskDeadline);
        const currentDate = new Date();

        let newStatus;
        if (currentDate > taskDeadline) {
          newStatus = "Undone"; // If task deadline has passed, set status to Undone
        } else {
          newStatus = "Done"; // Otherwise, set status to Done
        }

        // Update task status in the database
        db.run(
          "UPDATE Task SET Status = ? WHERE TaskID = ?",
          [newStatus, taskid],
          function (err) {
            if (err) {
              throw new Error("Error updating task status: " + err.message);
            }

            res
              .status(200)
              .json({ message: "Task status updated successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Error in closeTaskReport:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function getTaskDetailReport(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  try {
    const taskId = req.params.taskid;

    // Query the database to get ReportData, TextData, and ReportType for the task
    db.all(
      "SELECT ReportID, ReportData, TextData, ReportType FROM TaskReport WHERE TaskID = ?",
      [taskId],
      (err, rows) => {
        if (err) {
          console.error("Error querying database:", err.message);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json(rows);
        }
      }
    );
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function deleteReportData(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);
  try {
    const taskId = req.params.taskid;
    const selectedReports = req.body.selectedReports;

    // Ensure selectedReports is an array
    if (!Array.isArray(selectedReports)) {
      return res
        .status(400)
        .json({ error: "Invalid report IDs. Expected an array." });
    }

    // Prepare and execute DELETE queries for each report ID
    selectedReports.forEach((reportId) => {
      const sql = "DELETE FROM TaskReport WHERE ReportID = ? AND TaskID = ?";
      db.run(sql, [reportId, taskId], function (err) {
        if (err) {
          console.error(
            `Error deleting report with ID ${reportId}:`,
            err.message
          );
        } else {
          if (this.changes === 0) {
            console.error(
              `Report with ID ${reportId} is not linked to TaskID ${taskId}.`
            );
          } else {
            console.log(`Report with ID ${reportId} deleted successfully.`);
          }
        }
      });
    });

    // Send success response
    res.status(200).json({ message: "Report(s) deleted successfully." });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

function submitTaskReport(req, res) {
  console.log(`Received ${req.method} request for ${req.url}`);

  try {
    const taskid = req.params.taskid;
    const { files, fileTypes, text } = req.body;

    //console.log("Task ID:", taskid);
    //console.log("Files:", files);
    //console.log("File Types:", fileTypes);
    //console.log("Text:", text);

    // Convert Base64 strings back to Buffer objects
    const buffers = files.map((file) => Buffer.from(file, "base64"));

    // Insert data into the database
    for (let i = 0; i < buffers.length; i++) {
      const fileBuffer = buffers[i];
      const fileType = fileTypes[i];
      //console.log("buffer", fileBuffer);

      // Insert data into TaskReport table
      db.run(
        "INSERT INTO TaskReport (TaskID, ReportType, ReportData, TextData) VALUES (?, ?, ?, ?)",
        [taskid, fileType, fileBuffer, text],
        function (err) {
          if (err) {
            console.error("Error inserting data:", err.message);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            console.log("Data inserted successfully");
          }
        }
      );
    }

    // Send a success response
    res.status(200).json({ message: "Task report submitted successfully" });
  } catch (error) {
    console.error("Error in submitTaskReport:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function notifyTask(req, res) {}

module.exports = {
  addTask,
  getTask,
  updateTask,
  deleteTask,
  approveTask,
  getApproveTask,
  getPendingApproveTask,
  closeTaskReport,
  AssignTask,
  requestJoinTask,
  approveRequestJoin,
  getAllRequestJoin,
  getMyTasks,
  getTaskDetailReport,
  getUserTaskAssigned,
  notifyTask,
  removeRequestJoin,
  submitTaskReport,
  deleteReportData,
};
