const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
const { createOrUpdateQuestion } = require("./utils");


exports.updateAnswer = async function(req, res, next) {
    if (req.method === "PUT") {
        try {
            const { proposalID, questionID, answer } = req.body;

            const userEmail = req.user.email;

            // Retrieve the existing proposal document
            const proposalRef = db.collection("proposals").doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: 'Proposal not found!' });
                return;
            }
            const existingProposal = proposalSnapshot.data();

            // Get the proposal isDeleted status
            const proposalStatus = existingProposal ?.isDeleted.status || false;

            if (proposalStatus == true) {
                res.status(400).json({ message: 'proposal has been deleted' });
                return;
            }

            // Find the index of the question within the questions array
            const questionIndex = existingProposal.questions.findIndex(
                (q) => q.questionID === questionID
            );

            // Check if the question exists in the proposal
            if (questionIndex === -1) {
                res.status(404).json({ message: 'Question not found in proposal!' });
                return;
            }

            // Get the question status
            const questionStatus =
                existingProposal.questions[questionIndex] ?.isDeleted.status || false;

            // if isDeleted?.status is true then couldn't update answer
            if (questionStatus == true) {
                res.status(400).json({ message: 'question has been deleted' });
                return;
            }

            // Update the answer field of the question
            if (existingProposal.questions[questionIndex].answer !== answer) {
                const previousAnswer = existingProposal.questions[questionIndex].answer;
                existingProposal.questions[questionIndex].answer = answer;

                const updated = {
                    userEmail,
                    operationType: OPERATION_TYPE.EDIT,
                    question: {
                        questionID,
                        previousAnswer: previousAnswer,
                        currentAnswer: answer
                    }
                }
                await createOrUpdateQuestion(proposalRef, existingProposal, updated);
            }


            res
                .status(200)
                .json({ message: "Question answer updated successfully!" });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.EDIT ,
                details: ` ${questionID}'s answer was updated `,
            }
            next()
        } catch (error) {
            //console.error("Error updating question answer:", error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}