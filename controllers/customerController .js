const crudHandlerFactory = require("./crudHandlerFactory.js");
const Customer = require("../models/Customer.js");
// ///////////////////////////////////
// CRUD Using crudHandlerFactory

// @desc   Retrieve a list of Customers
// @route  GET /api/v1/Customers/
// @access Admin access only
exports.indexCustomers = crudHandlerFactory.indexDoc(Customer);

// @desc   Retrieve a single Customer by ID
// @route  GET /api/v1/Customers/:id
// @access Admin access only
exports.showCustomer = crudHandlerFactory.showDoc(Customer);

// @desc   Create a Customer
// @route  POST /api/v1/Customers/:id
// @access Admin access only
exports.storeCustomer = crudHandlerFactory.storeDoc(Customer);

// @desc   Update a Customer
// @route  PATCH /api/v1/Customers/:id
// @access Admin access only
exports.updateCustomer = crudHandlerFactory.updateDoc(Customer);

// @desc   Delete a Customer
// @route  DELETE /api/v1/Customers/:id
// @access Admin access only
exports.destroyCustomer = crudHandlerFactory.destroyDoc(Customer);
