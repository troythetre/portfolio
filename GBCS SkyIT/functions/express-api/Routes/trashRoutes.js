// routes/proposalRoutes.js
const express = require('express');
const router = express.Router();


const getProposalTrashController = require('../Controllers/trash/getTrashList');
const { protect, isAdmin, isRegistered } = require('../Middleware/auth')

router.get('/archive', protect, isRegistered, getProposalTrashController.getTrashList);

module.exports = router;