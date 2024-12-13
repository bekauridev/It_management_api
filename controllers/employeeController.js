const crudHandlerFactory = require("./crudHandlerFactory");
const Employee = require("../models/Employee.js");
// ///////////////////////////////////
// CRUD Using crudHandlerFactory

// @desc   Retrieve a list of Employees
// @route  GET /api/v1/Employees/
// @access Admin access only
exports.indexEmployees = crudHandlerFactory.indexDoc(Employee);

// @desc   Retrieve a single Employee by ID
// @route  GET /api/v1/Employees/:id
// @access Admin access only
exports.showEmployee = crudHandlerFactory.showDoc(Employee);

// @desc   Create a Employee
// @route  POST /api/v1/Employees/:id
// @access Admin access only
exports.storeEmployee = crudHandlerFactory.storeDoc(Employee);

// @desc   Update a Employee
// @route  PATCH /api/v1/Employees/:id
// @access Admin access only
exports.updateEmployee = crudHandlerFactory.updateDoc(Employee);

// @desc   Delete a Employee
// @route  DELETE /api/v1/Employees/:id
// @access Admin access only
exports.destroyEmployee = crudHandlerFactory.destroyDoc(Employee);
