import { db, verifyToken } from "./firebase";

async function updateQuestionAnswer(data) {
  const { proposalID, questionID, responseID } = data;

  try {
    // Retrieve the existing proposal document
    const proposalRef = db.collection("proposals").doc(proposalID);
    const proposalSnapshot = await proposalRef.get();

    if (!proposalSnapshot.exists) {
      throw new Error("Proposal not found!");
    }

    const existingProposal = proposalSnapshot.data();

    // Get the proposal isDeleted status
    const proposalStatus = existingProposal?.isDeleted?.status || false;

    if (proposalStatus) {
      throw new Error("Proposal has been deleted");
    }

    // Find the index of the question within the questions array
    const questionIndex = existingProposal.questions.findIndex(
      (q) => q.questionID === questionID
    );

    if (questionIndex === -1) {
      throw new Error("Question not found in proposal!");
    }

    // Check if the question is deleted
    const questionStatus =
      existingProposal.questions[questionIndex]?.isDeleted?.status || false;

    if (questionStatus) {
      throw new Error("Question has been deleted!");
    }

    // Fetch the response data based on responseID
    const responseDoc = await db.collection("responses").doc(responseID).get();

    if (!responseDoc.exists) {
      throw new Error("Response not found!");
    }

    const responseData = responseDoc.data();

    // Check if the response is deleted
    if (responseData?.isDeleted?.status) {
      throw new Error("Response has been deleted!");
    }

    // Update the question and answer fields using response data if they are defined
    if (responseData.Answer !== undefined) {
      existingProposal.questions[questionIndex].answer = responseData.Answer;
    }

    if (responseData.Question !== undefined) {
      existingProposal.questions[questionIndex].question = responseData.Question;
    }

    // Update the proposal document with the modified questions array
    await proposalRef.update({ questions: existingProposal.questions });

    return { message: "Question and answer updated successfully!" };
  } catch (error) {
    console.error("Error updating question and answer:", error);
    throw error;
  }
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

      const { proposalID, questionID, responseID } = req.body;

      const result = await updateQuestionAnswer({
        proposalID,
        questionID,
        responseID,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating question and answer:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
