const express = require("express");
const {
  createEmployeeHandler,
  getAllEmployeesHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
  downloadEmployeeDataHandler,
  handleUploadEmployeeDetails,
} = require("../controllers/employeeController");
const {
  createEmployeeValidation,
} = require("../serializers/employeeSerializer");
const multer = require("multer");

// below commented code is for when we need to store file in our code in storage folder
// const fs = require("fs");
// const path = require("path");

// // Ensure the storage directory exists
// const storageDir = path.join("../../", "storage");

// if (!fs.existsSync(storageDir)) {
//   fs.mkdirSync(storageDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, res, cb) {
//     return cb(null, storageDir);
//   },
//   filename: function (req, file, cb) {
//     console.log("filefilefilefile", file);

//     return cb(null, Date.now() + "_" + file.originalname);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({ storage });

const router = express.Router();

router.post("/create", createEmployeeValidation, createEmployeeHandler);
router.get("/get-employee-details", getAllEmployeesHandler);
router.put(
  "/update-employee-details/:id",
  createEmployeeValidation,
  updateEmployeeHandler
);
router.delete("/delete-employee-details/:id", deleteEmployeeHandler);
router.get("/download-employee-data", downloadEmployeeDataHandler);
router.post(
  "/upload-employee-details",
  upload.single("file"),
  handleUploadEmployeeDetails
);

module.exports = router;
