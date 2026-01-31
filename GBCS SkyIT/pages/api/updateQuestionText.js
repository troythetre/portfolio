import admin from "firebase-admin";
import { db, verifyToken } from "./firebase";

export default async function handler(req, res) {
    if (req.method === "PUT") {
        try {
            const bearerToken = req.headers.authorization?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }

            // Verify the Firebase ID token
            const isTokenValid = await verifyToken(bearerToken);

            if (!isTokenValid) {
                res.status(401).json({ error: "Invalid authentication token" });
                return;
            }

            const { proposalID, questionID, questionText } = req.body;

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

            // Update the question text
            existingProposal.questions[existingQuestionIndex].question = questionText;

            // Update the proposal document with the modified question
            await proposalSnapshot.ref.update({ questions: existingProposal.questions });

            res.status(200).json({ message: "Question text updated successfully!" });
        } catch (error) {
            console.error("Error updating question text:", error);
            res.status(500).json({ error: "Error updating question text" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
