// routes/proposalRoutes.js
const express = require("express");
const router = express.Router();

const addResponseController = require("../Controllers/responses/addResponse");
const addResponseFileController = require("../Controllers/responses/addResponseFromCSV");
const editResponseController = require("../Controllers/responses/editResponse");
const deleteResponseController = require("../Controllers/responses/deleteResponse");
const getResponseController = require("../Controllers/responses/getResponseByID");
const getAllResponseController = require("../Controllers/responses/getAllResponses");
const restoreResponseController = require("../Controllers/responses/restoreResponse");

const { protect, isAdmin, isRegistered } = require("../Middleware/auth");

router.post(
    "/add-response",
    protect,
    isRegistered,
    isAdmin,
    addResponseController.addResponse
);
router.post(
    "/add-response-csv-file",
    protect,
    isRegistered,
    isAdmin,
    addResponseFileController.addResponseFromCSV
);

router.get(
    "/single-response/:responseID",
    protect,
    isRegistered,
    getResponseController.getSingeResponse
);
router.get(
    "/responses",
    protect,
    isRegistered,
    getAllResponseController.getAllResponses
);

router.delete(
    "/delete-response",
    protect,
    isRegistered,
    isAdmin,
    deleteResponseController.deleteResponse
);
router.put(
    "/restore-response",
    protect,
    isRegistered,
    isAdmin,
    restoreResponseController.restoreResponse
);
router.put(
    "/edit-response",
    protect,
    isRegistered,
    isAdmin,
    editResponseController.editResponse
);

module.exports = router;