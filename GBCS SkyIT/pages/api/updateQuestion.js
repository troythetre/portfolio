import { db, verifyToken } from "./firebase";
// Helper function to validate the question status
function validateQuestionStatus(status) {
  const allowedStatuses = ['in progress', 'request for review', 'under review', 'changes requested', 'approved'];
  if (allowedStatuses.includes(status.toLowerCase())) {
    return status.toLowerCase();
  } else {
    return 'in progress'; // Set default status to 'in progress' if not a valid status
  }
}
async function updateQuestionInProposal(data) {
  try {
    const { proposalID, questionID, status,...questionFields } = data;

    // Retrieve the auto-generated ID of the question document
    const querySnapshot = await db
      .collection("proposals")
      .doc(proposalID)
      .collection("questions")
      .where("questionID", "==", questionID)
      .get();

    if (querySnapshot.empty) {
      throw new Error("Question not found in proposal");
    }

    const questionDoc = querySnapshot.docs[0];
    const questionDocRef = questionDoc.ref;

    // Update the question document, including the answer field
    await questionDocRef.update({
      ...questionFields,
      answer: questionFields.answer, // Update the answer field
      // Validate proposal status
    status: validateQuestionStatus(questionFields.status)
    
    });
  } catch (error) {
    console.error("Error updating question in proposal:", error);
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

      if (isTokenValid) {
        const { proposalID, questionID, ...questionFields } = req.body;

        await updateQuestionInProposal({ proposalID, questionID, ...questionFields });

        res.status(200).json({ message: "Question updated successfully!" });
      } else {
        res.status(401).json({ error: "Invalid authentication token" });
      }
    } catch (error) {
      console.error("Error updating question in proposal:", error);
      res.status(500).json({ error: "Error updating question in proposal" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}