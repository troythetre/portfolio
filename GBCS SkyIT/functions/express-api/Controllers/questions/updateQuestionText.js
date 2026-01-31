const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
const { createOrUpdateQuestion } = require("./utils");

exports.updateQuestionText = async function(req, res, next) {
    if (req.method === "PUT") {
        try {

            const { proposalID, questionID, questionText } = req.body;

            const userEmail = req.user.email;

            // Retrieve the existing proposal document
            const proposalSnapshot = await db.collection("proposals").doc(proposalID).get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: "Proposal not found!" });
                return;
            }

            const existingProposal = proposalSnapshot.data();

            // Check if proposal is deleted
            if (existingProposal.isDeleted.status == true) {
                res.status(400).json({ message: "Cannot perform action on a deleted proposal." });
                return;
            }

            // Find the question with the specified questionID
            const existingQuestion = existingProposal.questions.find((q) => q.questionID === questionID);
            const existingQuestionIndex = existingProposal.questions.findIndex(q => q.questionID === questionID);

            if (existingQuestionIndex === -1) {
                res.status(404).json({ message: "Question not found!" });
                return;
            }
            // check if question is deleted 
            if (existingQuestion.isDeleted.status) {
                res.status(400).json({ error: 'Question is marked as deleted' });
                return;
            }

            // Update the question text, add pervious question text and new question text to version history
            if (existingProposal.questions[existingQuestionIndex].question !== questionText) {
                const previousQuestion = existingProposal.questions[existingQuestionIndex].question;
                existingProposal.questions[existingQuestionIndex].question = questionText;

                updated = {
                    userEmail,
                    operationType: OPERATION_TYPE.EDIT,
                    question: {
                        questionID,
                        previousQuestion: previousQuestion,
                        currentQuestion: questionText
                    }
                }
                await createOrUpdateQuestion(proposalSnapshot.ref, existingProposal, updated);
            }

            res.status(200).json({ message: "Question text updated successfully!" });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.EDIT,
                details: ` ${questionID}'s text was updated `,
            }
            next()
        } catch (error) {
            // console.error("Error updating question text:", error);
            res.status(500).json({ error: "Error updating question text: " + error});
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}