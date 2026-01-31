const express = require("express");
const router = express.Router();
const {protect, isRegistered} = require("../Middleware/auth");

const updateMediaFilesController = require("../Controllers/otherFields/updateMediaFiles");
const updateColorsController = require("../Controllers/otherFields/updateColors");
const updateClientLogoController = require("../Controllers/otherFields/updateClientLogo");
const updatePagesController = require("../Controllers/otherFields/updatePages");

router.post(
  "/update-colors",
  protect,
  isRegistered,
  updateColorsController.updateColors
);
router.post(
  "/update-media-files",
  protect,
  isRegistered,
  updateMediaFilesController.updateMediaFiles
);
router.post(
  "/update-client-logo",
  protect,
  isRegistered,
  updateClientLogoController.updateClientLogo
);
router.post(
  "/update-pages",
  protect,
  isRegistered,
  updatePagesController.updatePages
);

module.exports = router;