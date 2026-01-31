const express = require("express");
const router = express.Router();

const addQuestionController = require("../Controllers/questions/addQuestion");
const addCommentController = require("../Controllers/questions/addComment");
const getQuestionController = require("../Controllers/questions/getQuestion");
const getCommentsController = require("../Controllers/questions/getQuestionCommentsList");
const getWritersController = require("../Controllers/questions/getQuestionWritersList");
const getReviewersController = require("../Controllers/questions/getQuestionReviewers");
const getStatusController = require("../Controllers/questions/getQuestionStatus");
const addWriterController = require("../Controllers/questions/addQuestionWriter");
const getDeadlinesController = require("../Controllers/questions/get-question-deadlines");
const addReviewerController = require("../Controllers/questions/addReviewer");
const updateStatusController = require("../Controllers/questions/updateQuestionStatus");
const updateAnswerController = require("../Controllers/questions/updateAnswer");
const updateQuestionTextController = require("../Controllers/questions/updateQuestionText");
const setDeadlineController = require("../Controllers/questions/setQuestionDeadline");
const deleteController = require("../Controllers/questions/deleteQuestion");
const updateWithResponseController = require("../Controllers/questions/updateQuestionWithResponse");
const restoreController = require("../Controllers/questions/restoreQuestionFromTrash");

const { protect, isRegistered } = require("../Middleware/auth");
const { historyLog } = require("../Middleware/logs");
router.post(
    "/add-question",
    protect,
    isRegistered,
    addQuestionController.addQuestion, historyLog
);
router.post(
    "/question-addComment",
    protect,
    isRegistered,
    addCommentController.addComment, historyLog
);

router.get(
    "/single-question/:proposalID/:questionID",
    protect,
    isRegistered,
    getQuestionController.getQuestion
);
router.get(
    "/question-commentsList/:proposalID/:questionID",
    protect,
    isRegistered,
    getCommentsController.getQuestionCommentList
);
router.get(
    "/question-writesList/:proposalID/:questionID",
    protect,
    isRegistered,
    getWritersController.getQuestionWritersList
);
router.get(
    "/question-reviewersList/:proposalID/:questionID",
    protect,
    isRegistered,
    getReviewersController.getQuestionReviewers
);
router.get(
    "/question-deadlines/:proposalID/:questionID",
    protect,
    isRegistered,
    getDeadlinesController.getQuestionDeadlines
);
router.get(
    "/question-status/:proposalID/:questionID",
    protect,
    isRegistered,
    getStatusController.getQuestionStatus
);

router.put(
    "/question-addWriter",
    protect,
    isRegistered,
    addWriterController.addQuestionWriter, historyLog
);
router.put(
    "/question-addReviewer",
    protect,
    isRegistered,
    addReviewerController.addReview, historyLog
);
router.put(
    "/question-updateStatus",
    protect,
    isRegistered,
    updateStatusController.updateQuestionStatus, historyLog
);
router.put(
    "/question-updateAnswer",
    protect,
    isRegistered,
    updateAnswerController.updateAnswer, historyLog
);
router.put(
    "/question-updateQuestionText",
    protect,
    isRegistered,
    updateQuestionTextController.updateQuestionText, historyLog
);
router.put(
    "/question-setDeadline",
    protect,
    isRegistered,
    setDeadlineController.setQuestionDeadline, historyLog
);
router.put(
    "/restore-question",
    protect,
    isRegistered,
    restoreController.restoreQuestion, historyLog
);
router.put(
    "/question-updateWithResponse",
    protect,
    isRegistered,
    updateWithResponseController.updateQuestionWithResponse, historyLog
);

router.delete(
    "/delete-question",
    protect,
    isRegistered,
    deleteController.deleteQuestion, historyLog
);

module.exports = router;