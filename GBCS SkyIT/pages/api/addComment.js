import { db, decodeToken } from "./firebase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const bearerToken = req.headers.authorization?.split(" ")[1];

      if (!bearerToken) {
        res.status(401).json({ error: "Missing authentication token" });
        return;
      }

      // Verify the Firebase ID token and get the decoded token info
      const decodedToken = await decodeToken(bearerToken);

      console.log("Decoded Token:", decodedToken);

      if (!decodedToken || !decodedToken.email) {
        res.status(401).json({ error: "Invalid authentication token" });
        return;
      }

      const { proposalID, questionID, comment } = req.body;

      // Retrieve the existing proposal document
      const proposalSnapshot = await db.collection("proposals").doc(proposalID).get();

      // Check if the proposal document exists
      if (!proposalSnapshot.exists) {
        res.status(404).json({ message: "Proposal not found!" });
        return;
      }

      const existingProposal = proposalSnapshot.data();

      // Find the question with the specified questionID
      const existingQuestion = existingProposal.questions.find((q) => q.questionID === questionID);

      if (!existingQuestion) {
        res.status(404).json({ message: "Question not found!" });
        return;
      }

      // Add the comment to the existing question
      existingQuestion.comments.push({
        comment: comment,
        email: decodedToken.email,
      });

      // Update the proposal document with the modified question
      await proposalSnapshot.ref.update({ questions: existingProposal.questions });

      res.status(200).json({ message: "Comment added successfully!" });
    } catch (error) {
      console.error("Error adding comment:", error);
      res.status(500).json({ error: "Error adding comment" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
