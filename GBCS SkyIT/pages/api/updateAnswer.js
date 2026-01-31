import { db, verifyToken } from "./firebase";

async function updateQuestionAnswer(data) {
  const { proposalID, questionID, answer } = data;

  // Retrieve the existing proposal document
  const proposalRef = db.collection("proposals").doc(proposalID);
  const proposalSnapshot = await proposalRef.get();

  // Check if the proposal document exists
  if (!proposalSnapshot.exists) {
    throw new Error("Proposal not found!");
  }
  const existingProposal = proposalSnapshot.data();

  // Get the proposal isDeleted status
  const proposalStatus = existingProposal?.isDeleted.status || false;

  if (proposalStatus == true) {
    throw new Error("proposal has been deleted");
  }

  // Find the index of the question within the questions array
  const questionIndex = existingProposal.questions.findIndex(
    (q) => q.questionID === questionID
  );

  // Check if the question exists in the proposal
  if (questionIndex === -1) {
    throw new Error("Question not found in proposal!");
  }

  // Get the question status
  const questionStatus =
    existingProposal.questions[questionIndex]?.isDeleted.status || false;

  // if isDeleted?.status is true then couldn't update answer
  if (questionStatus == true) {
    throw new Error("question has been deleted!");
  }

  // Update the answer field of the question
  existingProposal.questions[questionIndex].answer = answer;

  // Update the proposal document with the modified questions array
  await proposalRef.update({ questions: existingProposal.questions });
}

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

      const { proposalID, questionID, answer } = req.body;

      await updateQuestionAnswer({ proposalID, questionID, answer });

      res
        .status(200)
        .json({ message: "Question answer updated successfully!" });
    } catch (error) {
      console.error("Error updating question answer:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
