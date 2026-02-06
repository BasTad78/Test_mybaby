//backend/routes/user.routes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

// router.post("/register", userController.register); // Moved to auth
// router.post("/login", userController.login); // Moved to auth
router.get("/", userController.getAllUsers);
router.get("/:id", userController.getUserById);
router.get("/:id/profile", userController.getProfile);
// router.put("/:id/profile", userController.updateProfile); // Not implemented yet
router.put("/:id/elo", userController.updateElo);

module.exports = router;

