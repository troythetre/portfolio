import { db, verifyToken } from "./firebase";

async function getQuestionWritersList(proposalID, questionID) {
  try {
    // Retrieve the proposal document
    const proposalRef = db.collection("proposals").doc(proposalID);
    const proposalDoc = await proposalRef.get();

    if (!proposalDoc.exists) {
      throw new Error("Proposal not found");
    }

    // Retrieve the question data from the proposal document
    const proposalData = proposalDoc.data();

    // Get the proposal isDeleted status
    const proposalStatus = proposalData.isDeleted?.status || false;
    if (proposalStatus == true) {
      throw new Error("Proposal has been deleted!");
    }

    const questions = proposalData.questions || [];

    // Find the question that matches the questionID
    const question = questions.find((q) => q.questionID === questionID);

    if (!question) {
      throw new Error("Question not found");
    }

    // Get the question status
    const questionStatus = question.isDeleted?.status || false;

    if (questionStatus == true) {
      throw new Error("Question has been deleted!");
    }

    const writers = question.writers || [];

    return writers;
  } catch (error) {
    console.error('Error retrieving question writers:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
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

      const { proposalID, questionID } = req.body;

      if (!proposalID) {
        res.status(400).json({ error: "Missing proposalID parameter" });
        return;
      }

      if (!questionID) {
        res.status(400).json({ error: "Missing questionID parameter" });
        return;
      }

      const writers = await getQuestionWritersList(proposalID, questionID);

      res.status(200).json({ writers });
    } catch (error) {
      console.error('Error getting question writers:', error);
      if (error.message === "Proposal not found") {
        res.status(404).json({ error: 'Proposal not found' });
      } else if (error.message === "Question not found") {
        res.status(404).json({ error: 'Question not found' });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}