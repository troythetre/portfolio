import admin from "firebase-admin";
import { db, verifyToken } from "./firebase";
import { addReviewTask } from "./taskFunctions"


export default async function handler(req, res) {
    // put rather than post because you are updating
    if (req.method === "PUT") {
        try {
            const bearerToken = req.headers.authorization ?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }

            // Verify the Firebase ID token
            const isTokenValid = await verifyToken(bearerToken);

            if (isTokenValid) {
                const { proposalID, questionID, reviewerEmail, reviewerDeadline } = req.body;

                // Make sure deadline is a date
                if (!isValidDate(reviewerDeadline)) {
                    res.status(400).json({ error: "Invalid deadline format. Use YYYY-MM-DD." });
                    return;
                }
                try {
                    // Make sure reviewerEmail is a registered user on firebase.
                    const userRecord = await admin.auth().getUserByEmail(reviewerEmail);
                } catch (error) {
                    res.status(400).json({ error: "Reviewer email is not registered." });
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
                let member = existingProposal.teamMembers.find(member => member.userEmail === reviewerEmail.email);
                if(!member) {
                    res.status(401).json({ error: "user isn't a team member"});
                    return;
                }

                // Check if reviewer already exists in the array with this constant
                const reviewerExists = existingQuestion.reviewers.findIndex((reviewer) => reviewer.email === reviewerEmail);

                if (reviewerExists !== -1) {
                    // if the reviewer already exists, just update the deadline
                    existingQuestion.reviewers[reviewerExists].deadline = reviewerDeadline;
                } else {
                    // else add reviewer to the array
                    existingQuestion.reviewers.push({ email: reviewerEmail, deadline: reviewerDeadline });
                    // Add reviewer to the proposal's teamMembers array if not already present
                    if (!existingProposal.teamMembers.includes(reviewerEmail)) {
                        existingProposal.teamMembers.push(reviewerEmail);
                    }
                }
                
                // Update the proposal document with the modified teamMembers array
                await proposalRef.update({ teamMembers: existingProposal.teamMembers });    

                // Update the proposal document with the modified question
                await proposalSnapshot.ref.update({ questions: existingProposal.questions });

                //add reviewer task to user collection
                await addReviewTask(reviewerEmail, proposalID, questionID, reviewerDeadline)

                res.status(200).json({ message: "Reviewer added successfully!" });
            } else {
                res.status(401).json({ error: "Invalid authentication token" });
            }
        } catch (error) {
            console.error("Error adding reviewer:", error);
            res.status(500).json({ error: "Error adding reviewer" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}


function isValidDate(dateString) {
    // Regular expression to match the date format (YYYY-MM-DD)
    const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/;
    return dateRegex.test(dateString);
}
