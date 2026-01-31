const express = require('express');
const router = express.Router();


const addSectionController = require('../Controllers/sections/addSection');
const assignQuestionsController = require('../Controllers/sections/assignQuestionToSection');
const reAssignQuestionsController = require('../Controllers/sections/reassignQuestionsToSection');
const restoreSectionController = require('../Controllers/sections/restoreSection');
const deleteSectionController = require('../Controllers/sections/deleteSection');
const getSectionContentController = require('../Controllers/sections/getSectionContent');
const { protect, isAdmin, isRegistered } = require('../Middleware/auth')
const { historyLog } = require("../Middleware/logs");
router.put('/add-section', protect, isRegistered, addSectionController.addSection, historyLog);
router.put('/section/assign-question', protect, isRegistered, assignQuestionsController.assignQuestion, historyLog);
router.put('/section/reassign-question', protect, isRegistered, reAssignQuestionsController.reassignQuestions, historyLog);
router.put('/restore-section', protect, isRegistered, restoreSectionController.restoreSection, historyLog);
router.delete('/delete-section', protect, isRegistered, deleteSectionController.deleteSection, historyLog);
router.get(
    "/section/get-section-content/:proposalID/:sectionID",
    protect,
    isRegistered,
    isAdmin,
    getSectionContentController.getSectionContent, historyLog
);
module.exports = router;