const express = require("express");
const router = express.Router();


// Declare Controller Functions
const getAllUsersController = require("../Controllers/users/getUsers");
const getAdminsController = require("../Controllers/users/getAdminUsers");
const UpdateRoleController = require("../Controllers/users/getUpdateRole");
const useAuthCodeController = require('../Controllers/users/useAuthCode');
const getAllAuthCodesController = require("../Controllers/users/getAllAuthCodes");
const generateAuthCodeController = require("../Controllers/users/generateAuthCode");


// Generate Middleware
const { protect, isRegistered, isAdmin } = require("../Middleware/auth");


// Establish Routes
router.get("/all-users", protect, isRegistered, getAllUsersController.getUsers);
router.get("/admin-users", protect, isRegistered, getAdminsController.getAdminUsers);
router.put("/users/assign-role", protect, isRegistered, isAdmin, UpdateRoleController.UpdateRole);
router.put('/use-auth-code', protect, isRegistered, useAuthCodeController.useAuthCode);
router.get(
  "/get-all-auth-codes",
  protect,
  isRegistered,
  isAdmin,
  getAllAuthCodesController.getAllAuthCodes
);
router.post(
  "/generate-auth-code",
  protect,
  isRegistered,
  isAdmin,
  generateAuthCodeController.generateAuthCode
);

module.exports = router;
