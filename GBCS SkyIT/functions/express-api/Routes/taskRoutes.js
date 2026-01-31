// routes/proposalRoutes.js
const express = require('express');
const router = express.Router();


const getTaskController = require('../Controllers/tasks/getTaskList');
const updateTaskController = require('../Controllers/tasks/updateTaskStatus');
const { protect, isAdmin, isRegistered } = require('../Middleware/auth')

router.get('/user/task', protect, isRegistered, getTaskController.getTaskList);
router.put('/user/update-task', protect, isRegistered, updateTaskController.updateTaskStatus);

module.exports = router;