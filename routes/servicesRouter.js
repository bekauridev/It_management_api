const express = require("express");
const serviceController = require("../controllers/serviceController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect, authController.checkRole("admin"));

router
  .route("/")
  .get(serviceController.indexServices)
  .post(serviceController.storeService);

router
  .route("/:id")
  .patch(serviceController.updateService)
  .delete(serviceController.destroyService)
  .get(serviceController.showService);

module.exports = router;
