const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
exports.addComment = async function(req, res, next) {
    if (req.method === "POST") {
        try {
            const { proposalID, questionID, comment } = req.body;

            // Retrieve the existing proposal document
            const proposalSnapshot = await db.collection("proposals").doc(proposalID).get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: "Proposal not found!" });
                return;
            }

            const existingProposal = proposalSnapshot.data();

            // Check if the proposal document was tagged as deleted
            if (existingProposal.isDeleted.status == true) {
                res.status(400).json({ message: "Proposal has been deleted!" });
                return;
            }

            // Find the question with the specified questionID
            const existingQuestion = existingProposal.questions.find((q) => q.questionID === questionID);

            if (!existingQuestion) {
                res.status(404).json({ message: "Question not found!" });
                return;
            }
            if (existingQuestion.isDeleted.status == true) {
                res.status(400).json({ message: "Question has been deleted!" });
                return;
            }


            // Add the comment to the existing question
            existingQuestion.comments.push({
                comment: comment,
                email: req.user.email,
            });

            // Update the proposal document with the modified question
            await proposalSnapshot.ref.update({ questions: existingProposal.questions });

            res.status(200).json({ message: "Comment added successfully!" });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.COMMENT,
                details: `new comment added to ${questionID} `,
            }
            next()
        } catch (error) {
            //console.error("Error adding comment:", error);
            res.status(500).json({ error: "Error adding comment" });

        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}