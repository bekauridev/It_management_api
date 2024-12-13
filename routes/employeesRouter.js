const express = require("express");
const employeesController = require("../controllers/employeeController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.checkRole("admin"));
router
  .route("/")
  .get(employeesController.indexEmployees)
  .post(employeesController.storeEmployee);

router
  .route("/:id")
  .patch(employeesController.updateEmployee)
  .delete(employeesController.destroyEmployee)
  .get(employeesController.showEmployee);

module.exports = router;
