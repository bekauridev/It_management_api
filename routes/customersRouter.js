const express = require("express");
const customerController = require("../controllers/customerController ");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.checkRole("admin"));

router
  .route("/")
  .get(customerController.indexCustomers)
  .post(customerController.storeCustomer);

router
  .route("/:id")
  .patch(customerController.updateCustomer)
  .delete(customerController.destroyCustomer)
  .get(customerController.showCustomer);

module.exports = router;
