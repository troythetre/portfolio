// routes/proposalRoutes.js
const express = require("express");
const router = express.Router();

const createProposalController = require("../Controllers/proposals/createProposal");
const getProposalController = require("../Controllers/proposals/getProposalList");
const getSingleProposalController = require("../Controllers/proposals/getSingleProposal");
const deleteProposalController = require("../Controllers/proposals/deleteProposal");
const restoreProposalController = require("../Controllers/proposals/restoreProposal");
const bookmarkProposalController = require("../Controllers/proposals/bookmarkProposal");
const getbookmarkedProposalController = require("../Controllers/proposals/getBookmarkProposals");
const addTeamMemberController = require("../Controllers/proposals/addTeamMembersProposal");
const removeTeamMemberController = require("../Controllers/proposals/removeTeamMember");
const getTeamMemberController = require("../Controllers/proposals/getProposalTeamMembers");
const updateStatusController = require("../Controllers/proposals/updateProposalStatus");
const getProposalStatusController = require("../Controllers/proposals/getProposalStatus");
const proposalStatusNotesController = require("../Controllers/proposals/getProposalStatusNotes");
const proposalMilestonesController = require("../Controllers/proposals/getProposalMilestones");
const proposalApprovalController = require("../Controllers/proposals/addProposalApprover");
const getProposalQuestionController = require("../Controllers/proposals/getProposalQuestions");
const setTeamLeadController = require("../Controllers/proposals/setTeamLead");
const removeTeamLeadController = require("../Controllers/proposals/removeTeamLead");
const getProposalHistoryLogController = require("../Controllers/proposals/getProposalHistoryLog");

const { protect, isAdmin, isRegistered } = require("../Middleware/auth");
const { historyLog } = require("../Middleware/logs");
router.post(
    "/create",
    protect,
    isRegistered,
    createProposalController.createProposal, historyLog
);



router.get(
    "/allproposals",
    protect,
    isRegistered,
    getProposalController.getProposalList
);
router.get(
    "/single-proposal/:proposalID",
    protect,
    isRegistered,
    getSingleProposalController.getSingleProposal
);
router.get(
    "/bookmarkedproposals",
    protect,
    isRegistered,
    getbookmarkedProposalController.bookmarkedProposals
);
router.get(
    "/team-members/:proposalID",
    protect,
    isRegistered,
    getTeamMemberController.getTeamMembers
);
router.get(
    "/status/:proposalID",
    protect,
    isRegistered,
    getProposalStatusController.proposalStatus
);
router.get(
    "/status-notes/:proposalID",
    protect,
    isRegistered,
    proposalStatusNotesController.statusNotes
);
router.get(
    "/milestones/:proposalID",
    protect,
    isRegistered,
    proposalMilestonesController.milestones
);
router.get(
    "/questions/:proposalID",
    protect,
    isRegistered,
    getProposalQuestionController.getProposalQuestions
);
router.delete(
    "/delete",
    protect,
    isRegistered,
    deleteProposalController.deleteProposal, historyLog
);

router.put(
    "/restore",
    protect,
    isRegistered,
    restoreProposalController.restoreProposal, historyLog
);
router.put(
    "/bookmark",
    protect,
    isRegistered,
    bookmarkProposalController.bookmarkProposal, historyLog
);
router.put(
    "/approval-request",
    protect,
    isRegistered,
    proposalApprovalController.approvalRequest, historyLog
);
router.put(
    "/add-team-members",
    protect,
    isRegistered,
    isAdmin,
    addTeamMemberController.addTeamMembers, historyLog
);
router.put(
    "/remove-team-members",
    protect,
    isRegistered,
    isAdmin,
    removeTeamMemberController.removeTeamMember, historyLog
);
router.put(
    "/update-status",
    protect,
    isRegistered,
    isAdmin,
    updateStatusController.updateProposalStatus, historyLog
);
router.put(
    "/set-team-lead",
    protect,
    isRegistered,
    setTeamLeadController.setTeamLead, historyLog
);
router.get(
    "/history-log/:proposalID",
    protect,
    isRegistered,
    // getProposalHistoryLogController.getProposalHistoryLog
);

router.delete(
    "/remove-team-lead",
    protect,
    isRegistered,
    removeTeamLeadController.removeTeamLead, historyLog
)

module.exports = router;
