const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("usersv1.db");

const script = `
-- Create UserRole table
CREATE TABLE UserRole (
    UserRoleID INTEGER PRIMARY KEY,
    UserRoleName VARCHAR(255) NOT NULL,
    RoleType VARCHAR(50) NOT NULL
);

-- Insert initial data into UserRole
INSERT INTO UserRole (UserRoleName, RoleType) VALUES ('Standard User', 'Standard User');
INSERT INTO UserRole (UserRoleName, RoleType) VALUES ('Admin User', 'Admin User');

-- Create Company table
CREATE TABLE Company (
    CompanyID INTEGER PRIMARY KEY,
    CompanyName VARCHAR(255) NOT NULL UNIQUE,
    Address VARCHAR(255),
    Industry VARCHAR(255)
);

-- Create User table
CREATE TABLE User (
    UserID INTEGER PRIMARY KEY,
    Username VARCHAR(255) NOT NULL UNIQUE,
    FirstName VARCHAR(255),
    LastName VARCHAR(255),
    Email VARCHAR(255) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    UserRoleId INTEGER,
    CompanyID INTEGER,
    ParentUserID INTEGER,
    RoleType VARCHAR(50) NOT NULL,
    IsActive BOOLEAN DEFAULT 1,
    FOREIGN KEY (UserRoleId) REFERENCES UserRole(UserRoleID),
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID) ON DELETE CASCADE,
    FOREIGN KEY (ParentUserID) REFERENCES User(UserID) ON DELETE CASCADE
);

-- Create Task table
CREATE TABLE Task (
    TaskID INTEGER PRIMARY KEY,
    TaskTitle VARCHAR(255) NOT NULL,
    TaskDescription TEXT,
    TaskDeadline DATE,
    PriorityID INT,
    CompanyID INTEGER,
    TaskTypeID INT,
    UserID INTEGER,
    UserRoleID INTEGER,
    TaskCreationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ApprovalStatus VARCHAR(50) DEFAULT 'Pending',
    ApprovalTimestamp TIMESTAMP,
    ApproverUserID INTEGER,
    Status VARCHAR(50),
    DependentTaskID INTEGER,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (UserRoleID) REFERENCES UserRole(UserRoleID) ON DELETE CASCADE,
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID),
    FOREIGN KEY (DependentTaskID) REFERENCES Task(TaskID),
    FOREIGN KEY (ApproverUserID) REFERENCES User(UserID)
);

CREATE TABLE TaskAssignment (
    AssignmentID INTEGER PRIMARY KEY,
    TaskID INTEGER,
    AssignedUserID TEXT,
    RequestJoinUserID TEXT,
    FOREIGN KEY (TaskID) REFERENCES Task(TaskID) ON DELETE CASCADE
);

CREATE TABLE TaskReport (
    ReportID INTEGER PRIMARY KEY,
    TaskID INTEGER,
    ReportType VARCHAR(50) NOT NULL,
    ReportData BLOB,
    TextData TEXT,
    FOREIGN KEY (TaskID) REFERENCES Task(TaskID) ON DELETE CASCADE
);



-- Create UserTaskNotify table
CREATE TABLE UserTaskNotify (
    UserTaskID INTEGER PRIMARY KEY,
    TaskID INTEGER,
    UserID INTEGER,
    CompanyID INTEGER,
    TaskState VARCHAR(50),
    NotificationTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TaskID) REFERENCES Task(TaskID) ON DELETE CASCADE,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE,
    FOREIGN KEY (CompanyID) REFERENCES User(CompanyID) ON DELETE CASCADE
);

-- Create AuditTrail table
CREATE TABLE AuditTrail (
    AuditTrailID INTEGER PRIMARY KEY,
    TableName VARCHAR(255) NOT NULL,
    RecordID INTEGER NOT NULL,
    Action VARCHAR(50) NOT NULL,
    ActionTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UserID INTEGER,
    FOREIGN KEY (UserID) REFERENCES User(UserID)
);

-- Create AdminCompany table to track admin users in each company
CREATE TABLE AdminCompany (
    AdminCompanyID INTEGER PRIMARY KEY,
    UserID INTEGER,
    CompanyID INTEGER,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID)
);

-- Create ImageProfile table
CREATE TABLE ImageProfile (
    UserID INTEGER PRIMARY KEY,
    ImageData BLOB,
    FOREIGN KEY (UserID) REFERENCES User(UserID) ON DELETE CASCADE
);

-- Create Company Logo table
CREATE TABLE CompanyLogo (
    CompanyID INTEGER PRIMARY KEY,
    LogoData BLOB,
    FOREIGN KEY (CompanyID) REFERENCES Company(CompanyID) ON DELETE CASCADE
);

CREATE TRIGGER delete_image_profile
AFTER DELETE ON User
FOR EACH ROW
BEGIN
    DELETE FROM ImageProfile WHERE UserID = OLD.UserID;
END;

CREATE TRIGGER delete_task_assignment
AFTER DELETE ON Task
FOR EACH ROW
BEGIN
    DELETE FROM TaskAssignment WHERE TaskID = OLD.TaskID;
END;


`;

db.exec(script, function (err) {
  if (err) {
    console.error("Error executing script:", err.message);
  } else {
    console.log("Script executed successfully!");
  }
});
