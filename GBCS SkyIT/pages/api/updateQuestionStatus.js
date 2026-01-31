// pages/api/updateQuestionStatus.js

import { db, verifyToken } from "./firebase";

const allowedStatuses = ['in progress', 'request for review', 'under review', 'changes requested', 'approved'];

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
      if (existingProposal.isDeleted?.status) {
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
      if (existingProposal.questions[questionIndex].isDeleted?.status) {
        res.status(400).json({ message: 'Action not allowed on a deleted question' });
        return;
      }

      // Check if the provided status is one of the allowed statuses
      if (!allowedStatuses.includes(status)) {
        res.status(400).json({ message: 'Invalid question status' });
        return;
      }

      // Update the question status
      existingProposal.questions[questionIndex].status = status;

      // Save the updated proposal document
      await proposalRef.set(existingProposal);

      res.status(200).json({ message: 'Question status updated successfully' });
    } catch (error) {
      console.error("Error updating question status:", error);
      res.status(500).json({ error: "Error updating question status" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
