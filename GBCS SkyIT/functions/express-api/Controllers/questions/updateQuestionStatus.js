const { db } = require("../../firebase");
const { QUESTION_STATUS,OPERATION_TYPE } = require('../../voopConstants')
const { validateQuestionStatus } = require('../../helperFunctions')

exports.updateQuestionStatus = async function(req, res, next) {
    if (req.method === "PUT") {
        try {
            const { proposalID, questionID, status } = req.body;

            // Retrieve the existing proposal document
            const proposalRef = db.collection('proposals').doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: 'Proposal not found!' });
                return;
            }

            // Get the existing proposal data
            const existingProposal = proposalSnapshot.data();

            // Check if the proposal is deleted
            if (existingProposal.isDeleted ?.status) {
                res.status(400).json({ message: 'Action not allowed on a deleted proposal' });
                return;
            }

            // Find the index of the question within the questions array
            const questionIndex = existingProposal.questions.findIndex(q => q.questionID === questionID);

            // Check if the question exists in the proposal
            if (questionIndex === -1) {
                res.status(400).json({ message: 'Question not found in proposal!' });
                return;
            }

            // Check if the question is deleted
            if (existingProposal.questions[questionIndex].isDeleted ?.status) {
                res.status(400).json({ message: 'Action not allowed on a deleted question' });
                return;
            }

            // Check if the provided status is one of the allowed statuses
            if (!validateQuestionStatus(status, QUESTION_STATUS)) {
                res.status(400).json({ message: 'Invalid question status provided' });
                return;
            }

            // Update the question status
            existingProposal.questions[questionIndex].status = status.toLowerCase();

            // Save the updated proposal document
            await proposalRef.set(existingProposal);
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.EDIT,
                details: ` ${questionID} status changed`,
            }
            res.status(200).json({ message: 'Question status updated successfully' });
           
            next()
        } catch (error) {
             console.error("Error updating question status:", error);
            res.status(500).json({ error: "Error updating question status" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}