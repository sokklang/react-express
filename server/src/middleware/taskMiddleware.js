const db = require("../models/database");

const isTaskClosed = (req, res, next) => {
  try {
    const { taskid } = req.params;

    // Create a Promise
    const taskStatusPromise = new Promise((resolve, reject) => {
      db.get(
        "SELECT Status FROM Task WHERE TaskID = ?",
        [taskid],
        (err, result) => {
          if (err) {
            reject(err); // Reject the Promise if there's an error
          } else {
            resolve(result); // Resolve the Promise with the result
          }
        }
      );
    });

    // Handle the Promise
    taskStatusPromise
      .then((taskStatus) => {
        if (!taskStatus) {
          return res.status(404).json({ error: "Task not found" });
        }

        // Check if the task status is either "Done" or "Undone"
        if (taskStatus.Status === "Done" || taskStatus.Status === "Undone") {
          return res.status(403).json({ error: "Task is already Closed" });
        }

        // If task status is neither "Done" nor "Undone", proceed to the next middleware
        next();
      })
      .catch((error) => {
        console.error("Error in isTaskClosed middleware:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error("Error in isTaskClosed middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const isntTaskClosed = async (req, res, next) => {
  try {
    const { taskid } = req.params;

    const result = await new Promise((resolve, reject) => {
      db.get(
        "SELECT Status FROM Task WHERE TaskID = ?",
        [taskid],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });

    if (!result) {
      return res.status(404).json({ error: "Task not found" });
    }

    if (result.Status === "Done" || result.Status === "Undone") {
      next(); // Proceed to the next middleware
    } else if (result.Status === "Archived") {
      return res.status(403).json({ error: "Task already Archived" });
    } else {
      return res.status(403).json({ error: "Invalid Task status" });
    }
  } catch (error) {
    console.error("Error in isTaskClosed middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const isTaskClosedReqBody = (req, res, next) => {
  try {
    const { taskId } = req.body;

    // Create a Promise
    const taskStatusPromise = new Promise((resolve, reject) => {
      db.get(
        "SELECT Status FROM Task WHERE TaskID = ?",
        [taskId],
        (err, result) => {
          if (err) {
            reject(err); // Reject the Promise if there's an error
          } else {
            resolve(result); // Resolve the Promise with the result
          }
        }
      );
    });

    // Handle the Promise
    taskStatusPromise
      .then((taskStatus) => {
        if (!taskStatus) {
          return res.status(404).json({ error: "Task not found" });
        }

        // Check if the task status is either "Done" or "Undone"
        if (taskStatus.Status === "Done" || taskStatus.Status === "Undone") {
          return res.status(403).json({ error: "Task is already Closed" });
        }

        // If task status is neither "Done" nor "Undone", proceed to the next middleware
        next();
      })
      .catch((error) => {
        console.error("Error in isTaskClosed middleware:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
      });
  } catch (error) {
    console.error("Error in isTaskClosed middleware:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  isTaskClosed,
  isntTaskClosed,
  isTaskClosedReqBody,
};
