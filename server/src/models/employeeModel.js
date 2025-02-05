const db = require("../config/db");

const createEmployee = (name, age, position, email, officeDays, callback) => {
  // This query is used for inserting a single row into the table at a time, with placeholders for each column value. The ? placeholders are replaced with actual values one by one.
  const query = `
    INSERT INTO employeeDetails (name, age, position, email, officeDays, salary)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  db.query(
    query,
    [name, age, position, email, officeDays, Number(officeDays) * 800],
    (err, result) => {
      callback(err, result);
    }
  );
};

const getAllEmployees = (
  offset,
  limit,
  sortOrder,
  sortField,
  search,
  callback
) => {
  // Validate sortField and sortOrder (optional)
  const validSortFields = [
    "employeeId",
    "name",
    "age",
    "position",
    "email",
    "officeDays",
    "salary",
  ]; // Allowed sort fields
  const validSortOrders = ["ASC", "DESC"]; // Allowed sort orders

  // Validate the sortField
  const field = validSortFields.includes(sortField) ? sortField : "employeeId";
  // Validate the sortOrder
  const order = validSortOrders.includes(sortOrder) ? sortOrder : "DESC";

  const searchCondition = search
    ? `WHERE name LIKE ? OR email LIKE ? OR position LIKE ? OR age LIKE ? OR officeDays LIKE ? OR salary LIKE ? `
    : ``;

  const query = `
    SELECT * FROM employeeDetails
    ${searchCondition}
    ORDER BY ${field} ${order} 
    LIMIT ? OFFSET ?`;

  const queryParams = search
    ? [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        limit,
        offset,
      ]
    : [limit, offset];

  db.query(query, queryParams, (err, result) => {
    callback(err, result);
  });
};

const getTotalEmployeesCount = (search, callback) => {
  const searchCondition = search
    ? `WHERE name LIKE ? OR email LIKE ? OR position LIKE ? OR age LIKE ? OR officeDays LIKE ? OR salary LIKE ? `
    : ``;

  const query = `SELECT COUNT(*) AS total FROM employeeDetails ${searchCondition}`;

  const queryParams = search
    ? [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
      ]
    : [];

  db.query(query, queryParams, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, result[0].total);
  });
};

const updateEmployeeById = (
  id,
  name,
  age,
  position,
  email,
  officeDays,
  callback
) => {
  const query = `
    UPDATE employeeDetails
    SET name = ?, age = ?, position = ?, email = ?, officeDays = ?, salary = ?
    WHERE employeeId = ?
  `;
  db.query(
    query,
    [name, age, position, email, officeDays, Number(officeDays) * 800, id],
    (err, result) => {
      callback(err, result);
    }
  );
};

const deleteEmployeeById = (id, callback) => {
  const query = `
    DELETE FROM employeeDetails
    WHERE employeeId = ?
  `;
  db.query(query, [id], (err, result) => {
    callback(err, result);
  });
};

const createTableIfNotExists = (callback) => {
  const query = `
    CREATE TABLE IF NOT EXISTS employeeDetails (
      employeeId INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
      name VARCHAR(255),
      age INT,
      position VARCHAR(255),
      email VARCHAR(50),
      officeDays INT(2),
      salary INT
    )
  `;
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const downloadEmployeeDetails = (callback) => {
  const query = "SELECT * FROM employeeDetails";
  db.query(query, (err, result) => {
    callback(err, result);
  });
};

const uploadEmployeeDetails = (data) => {
  let result1 = data;
  if (data.length === 0) {
    throw new Error("No data to insert");
  }
  const values = data.map(
    ({ name, age, position, email, officeDays, salary }) => [
      name,
      age,
      position,
      email,
      officeDays,
      salary,
    ]
  );
  // This query uses a batch insert with placeholders. The ? placeholder is used for multiple rows of data.
  // In this case, the ? will be replaced with an array of values for each row to insert into the database.
  const query = `INSERT INTO employeeDetails (name, age, position, email, officeDays, salary) VALUES ?`;
  db.query(query, [values], (error, result) => {
    if (error) {
      throw new Error("Database Insert Failed");
    }
    result1 = result;
    return result;
  });
  return result1;
};

module.exports = {
  createEmployee,
  getAllEmployees,
  updateEmployeeById,
  deleteEmployeeById,
  createTableIfNotExists,
  downloadEmployeeDetails,
  uploadEmployeeDetails,
  getTotalEmployeesCount,
};
