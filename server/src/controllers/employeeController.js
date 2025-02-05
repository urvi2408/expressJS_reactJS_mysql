const {
  createEmployee,
  getAllEmployees,
  updateEmployeeById,
  deleteEmployeeById,
  createTableIfNotExists,
  downloadEmployeeDetails,
  uploadEmployeeDetails,
  getTotalEmployeesCount,
} = require("../models/employeeModel");
const transporter = require("../config/mailer");
require("dotenv").config();
const ExcelJS = require("exceljs");

const createEmployeeHandler = async (req, res) => {
  const { name, age, position, email, officeDays } = req.body;

  createTableIfNotExists((err) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to ensure table exists", err });
    }
  });

  createEmployee(
    name,
    age,
    position,
    email,
    officeDays,
    async (err, result) => {
      if (err) {
        return res
          .status(500)
          .send({ message: "Failed to create employee", err });
      }
      try {
        transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "Hello from NODEMAILER",
          cc: "bhavsarurvi143@gmail.com",
          bcc: "bhavsarurvi143@gmail.com",
          alternatives: [
            {
              contentType: "text/x-web-markdown",
              content: "**Hello world!**",
            },
          ],
          attachments: [
            {
              // utf-8 string as an attachment
              filename: "text1.txt",
              content: "hello world!",
            },
            {
              // binary buffer as an attachment
              filename: "Urvi_Bhavsar_React (2).docx",
              path: "/home/dell/Downloads/Urvi_Bhavsar_React (2).docx",
            },
          ],
          html: "<h1>Welcome</h1><p>That was easy!</p>This is a test email sent using Nodemailer .env. https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628",
        });
      } catch (emailError) {
        throw emailError;
      }
      res.send({
        data: { name, age, position, email, officeDays },
        message: "Employee added successfully",
      });
    }
  );
};

const getAllEmployeesHandler = (req, res) => {
  createTableIfNotExists((err) => {
    if (err) {
      return res.status(500).send({
        message: "Failed to ensure table exists",
        err,
      });
    }
    const {
      page = 1,
      pageSize = 5,
      sortField = "",
      sortOrder = "",
      search = "",
    } = req.query;
    const currentPage = parseInt(page, 10);
    const limit = parseInt(pageSize, 10);
    const offset = (currentPage - 1) * limit;

    getTotalEmployeesCount(search, (err, totalEntries) => {
      if (err) {
        return res.status(500).send({
          message: "Failed to fetch total employee count",
          err,
        });
      }

      getAllEmployees(
        offset,
        limit,
        sortOrder,
        sortField,
        search,
        (err, employees) => {
          if (err) {
            return res.status(500).send({
              message: "Failed to fetch employees",
              err,
            });
          }

          const next =
            currentPage * limit < totalEntries ? currentPage + 1 : null;

          res.send({
            data: employees,
            currentPage: !employees.length ? currentPage - 1 : currentPage,
            pageSize: limit,
            next,
            totalEntries,
            message: "Employee details fetched successfully",
          });
        }
      );
    });
  });
};

const updateEmployeeHandler = (req, res) => {
  const { id } = req.params;
  const { name, age, position, email, officeDays } = req.body;

  updateEmployeeById(
    id,
    name,
    age,
    position,
    email,
    officeDays,
    (err, result) => {
      console.log("resulltttt", result);

      if (err) {
        return res
          .status(500)
          .send({ message: "Failed to update employee", err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).send({ message: "Employee not found" });
      }
      res.send({
        data: { id, name, age, position, email, officeDays },
        message: "Employee updated successfully",
      });
    }
  );
};

const deleteEmployeeHandler = (req, res) => {
  const { id } = req.params;

  deleteEmployeeById(id, (err, result) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Failed to delete employee", err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: "Employee not found" });
    }
    res.send({ message: "Employee deleted successfully" });
  });
};

const downloadEmployeeDataHandler = (req, res) => {
  try {
    downloadEmployeeDetails((err, employees) => {
      if (err) {
        return res.status(500).json({ error: "Database query failed" });
      }

      if (!employees.length) {
        return res.status(404).json({ error: "No employee data found" });
      }

      // Create a new Excel workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Employees");

      // Define the columns with headers
      worksheet.columns = [
        { header: "ID", key: "employeeId", width: 10 },
        { header: "Name", key: "name", width: 20 },
        { header: "Age", key: "age", width: 10 },
        { header: "Position", key: "position", width: 20 },
        { header: "Email", key: "email", width: 30 },
        { header: "Office Days", key: "officeDays", width: 30 },
        { header: "Salary", key: "salary", width: 30 },
      ];

      // Apply styling to headers (Green background, white text, bold)
      worksheet.getRow(1).eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "00A050" }, // Green
        };
        cell.font = { bold: true, italic: true, color: { argb: "FFFFFF" } }; // White text
        cell.alignment = { horizontal: "center", vertical: "middle" };
      });

      // Add employee data and apply some styling for the data rows
      employees.forEach((employee) => {
        const row = worksheet.addRow(employee);
        row.eachCell((cell) => {
          cell.alignment = { horizontal: "center", vertical: "middle" }; // Center align cells
        });
        const emailCell = row.getCell("email");
        const ageCell = row.getCell("age");
        emailCell.font = { italic: true };
        emailCell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFF00" }, // Orange
        };
        if (employee.age > 50) {
          ageCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFA500" }, // Orange
          };
        } else if (employee.age >= 20 && employee.age <= 40) {
          ageCell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFF00" }, // Yellow
          };
        }
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + "EmployeeDetails.xlsx"
      );

      workbook.xlsx.write(res).then(() => res.end());
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const handleUploadEmployeeDetails = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    //Creates a new workbook instance using the ExcelJS library.
    const workbook = new ExcelJS.Workbook();
    // Loads the file buffer directly from memory into the workbook. The req.file.buffer is automatically populated by multer when using memoryStorage, which holds the uploaded file in memory.
    await workbook.xlsx.load(req.file.buffer); // Using file buffer from memory
    // await workbook.xlsx.readFile(filePath); // use only when file saved in our code in storage

    // After loading the Excel file, workbook.worksheets[0] accesses the first sheet (index 0) of the Excel file.
    const worksheet = workbook.worksheets[0];

    // Extract Column Headers
    const columnMap = {};
    // Retrieves the first row of the worksheet (row 1 is typically used for column headers). and Iterates over each cell in the first row. It gets the value of the cell and maps it to its column number (colNumber).
    // This is stored in the columnMap object with the cell's value as the key and the column number as the value.
    worksheet.getRow(1).eachCell((cell, colNumber) => {
      columnMap[cell.value?.toString().trim()] = colNumber;
    });

    // This loop ensures that the required columns (Name, Age, Position, Email) are present in the first row of the worksheet.
    for (const col of ["Name", "Age", "Position", "Email", "Office Days"]) {
      if (!columnMap[col]) {
        throw new Error(`Missing column: ${col} in the uploaded file.`);
      }
    }

    // Extract Data from Excel
    const data = [];
    const emails = [];

    worksheet.eachRow((row, rowIndex) => {
      const email = row.getCell(columnMap["Email"]).value;
      const salary = !!columnMap["Salary"]
        ? row.getCell(columnMap["Salary"]).value
        : Number(row.getCell(columnMap["Office Days"]).value) * 800;
      if (rowIndex !== 1) {
        data.push({
          name: row.getCell(columnMap["Name"]).value,
          age: row.getCell(columnMap["Age"]).value,
          position: row.getCell(columnMap["Position"]).value,
          email,
          officeDays: row.getCell(columnMap["Office Days"]).value,
          salary,
        });
        if (email) {
          emails.push(email); // Collect emails for sending later
        }
      }
    });
    if (!!emails.length) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: emails.join(","),
        subject: "Hello from NODEMAILER",
        cc: "bhavsarurvi143@gmail.com",
        bcc: "bhavsarurvi143@gmail.com",
        alternatives: [
          {
            contentType: "text/x-web-markdown",
            content: "**Hello world!**",
          },
        ],
        attachments: [
          {
            // utf-8 string as an attachment
            filename: "text1.txt",
            content: "hello world!",
          },
          {
            // binary buffer as an attachment
            filename: "Urvi_Bhavsar_React (2).docx",
            path: "/home/dell/Downloads/Urvi_Bhavsar_React (2).docx",
          },
        ],
        html: "<h1>Welcome</h1><p>That was easy!</p>This is a test email sent using Nodemailer .env. to downloaded emloyee https://medium.com/@y.mehnati_49486/how-to-send-an-email-from-your-gmail-account-with-nodemailer-837bf09a7628",
      });
    }
    // Insert Data into MySQL
    const result = await uploadEmployeeDetails(data);
    res.send({
      message: "Employee details added successfully",
      records: result.affectedRows,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error uploading file" });
  }
};

module.exports = {
  createEmployeeHandler,
  getAllEmployeesHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
  downloadEmployeeDataHandler,
  handleUploadEmployeeDetails,
};
