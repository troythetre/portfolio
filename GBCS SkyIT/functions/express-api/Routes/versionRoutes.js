const express = require("express");
const router = express.Router();
const {protect, isRegistered} = require("../Middleware/auth");

const getSpecificVersionController = require("../Controllers/versions/getSpecificVersion");
const getAllPreviousVersionsController = require("../Controllers/versions/getAllPreviousVersions");
const restoreVersionController = require("../Controllers/versions/restoreVersion");

router.get(
  "/specific-version/:proposalID/:seconds/:nanoseconds",
  protect,
  isRegistered,
  getSpecificVersionController.getSpecificVersion
);
router.get(
  "/all-previous-versions/:proposalID",
  protect,
  isRegistered,
  getAllPreviousVersionsController.getAllPreviousVersions
);
router.put(
  "/restore-version/",
  protect,
  isRegistered,
  restoreVersionController.restoreVersion
);

module.exports = router;