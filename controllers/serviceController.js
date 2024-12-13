const crudHandlerFactory = require("./crudHandlerFactory.js");
const Service = require("../models/Service.js");
// ///////////////////////////////////
// CRUD Using crudHandlerFactory

// @desc   Retrieve a list of Services
// @route  GET /api/v1/Services/
// @access Admin access only
exports.indexServices = crudHandlerFactory.indexDoc(Service);

// @desc   Retrieve a single Service by ID
// @route  GET /api/v1/Services/:id
// @access Admin access only
exports.showService = crudHandlerFactory.showDoc(Service);

// @desc   Create a Service
// @route  POST /api/v1/Services/:id
// @access Admin access only
exports.storeService = crudHandlerFactory.storeDoc(Service);

// @desc   Update a Service
// @route  PATCH /api/v1/Services/:id
// @access Admin access only
exports.updateService = crudHandlerFactory.updateDoc(Service);

// @desc   Delete a Service
// @route  DELETE /api/v1/Services/:id
// @access Admin access only
exports.destroyService = crudHandlerFactory.destroyDoc(Service);
