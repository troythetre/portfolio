const { db } = require("../../firebase");
const { isValidDate, isUserRegistered } = require("../../helperFunctions")
const { addReviewTask } = require("../../taskFunctions")
const { OPERATION_TYPE } = require("../../voopConstants");


exports.addReview = async function(req, res, next) {
    // put rather than post because you are updating
    if (req.method === "PUT") {
        try {

            const { proposalID, questionID, reviewerEmail, reviewerDeadline } = req.body;

            // Make sure deadline is a date
            if (!isValidDate(reviewerDeadline)) {
                res.status(400).json({ error: "Invalid deadline format" });
                return;
            }
            const reviewer_Deadline = isValidDate(reviewerDeadline) //set the deafult date format

            if (!isUserRegistered(reviewerEmail)) {
                res.status(400).json({ error: "User not registered in database" })
                return;
            }


            // Retrieve the existing proposal document
            const proposalRef = db.collection("proposals").doc(proposalID);
            const proposalSnapshot = await db.collection("proposals").doc(proposalID).get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: "Proposal not found!" });
                return;
            }

            const existingProposal = proposalSnapshot.data();

            // Check if proposal is deleted
            if (existingProposal.isDeleted.status) {
                res.status(400).json({ error: "Cannot perform action on a deleted proposal." });
                return;
            }

            // Find the question with the specified questionID
            const existingQuestion = existingProposal.questions.find((q) => q.questionID === questionID);

            if (!existingQuestion) {
                res.status(404).json({ message: "Question not found!" });
                return;
            }

            // Check if the question is deleted
            if (existingQuestion.isDeleted.status) {
                res.status(400).json({ error: "Cannot perform action on a deleted question." });
                return;
            }

            // Check if user is a team member before adding as a reviewer
            let member = existingProposal.teamMembers.find(member => member.userEmail === reviewerEmail);
            if (!member) {
                res.status(400).json({ error: "user isn't a team member" });
                return;
            }

            // Check if reviewer already exists in the array with this constant
            const reviewerExists = existingQuestion.reviewers.findIndex((reviewer) => reviewer.email === reviewerEmail);

            if (reviewerExists !== -1) {
                // if the reviewer already exists, just update the deadline
                existingQuestion.reviewers[reviewerExists].deadline = reviewer_Deadline;
            } else {
                // else add reviewer to the array
                existingQuestion.reviewers.push({ email: reviewerEmail, deadline: reviewer_Deadline });
            }

            // Update the proposal document with the modified teamMembers array
            await proposalRef.update({ teamMembers: existingProposal.teamMembers });

            // Update the proposal document with the modified question
            await proposalSnapshot.ref.update({ questions: existingProposal.questions });

            //add reviewer task to user collection
            await addReviewTask(reviewerEmail, proposalID, questionID, reviewerDeadline)
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.ASSIGN,
                details: ` ${reviewerEmail} was added as Reviewer on ${questionID} `,
            }

            res.status(200).json({ message: "Reviewer added successfully!" });

            next()

        } catch (error) {
            //console.error("Error adding reviewer:", error);
            res.status(500).json({ error: "Error adding reviewer" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}