const express = require("express");
const usersController = require("../controllers/usersController");
const authController = require("../controllers/authController");
const {
  declinePasswordUpdate,
} = require("../middlewares/declinePasswordUpdateMiddleware");

const router = express.Router();

// resources/userData.js

router.use(authController.protect);

router.patch("/updateMe", declinePasswordUpdate, usersController.updateMe);
router.delete("/deleteMe", usersController.deleteMe);
router.get("/getMe", usersController.getMe);

router.use(authController.checkRole("admin"));

// Admin-only routes
router.use(authController.checkRole("admin"));

// User management
router.route("/").get(usersController.indexUsers).post(usersController.storeUser);

router
  .route("/:id")
  .patch(declinePasswordUpdate, usersController.updateUser)
  .delete(usersController.destroyUser)
  .get(usersController.showUser);
module.exports = router;
