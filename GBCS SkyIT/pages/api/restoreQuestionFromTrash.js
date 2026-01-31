import { db, verifyToken } from "./firebase";

async function restoreQuestionFromTrash(trashID) {
  // Get Trash data
  const trashRef = db.collection("trash").doc(trashID);
  const trashSnapshot = await trashRef.get();

  if (!trashSnapshot.exists) {
    throw new Error("Trash document not found");
  }

  if (trashSnapshot.data().itemType !== "question") {
    throw new Error("itemType is not question in trashID");
  }

  // Get the proposal data
  const restorationInfo = trashSnapshot.data().restorationInfo;

  const proposalID = restorationInfo.proposalID;
  const questionID = restorationInfo.questionID;

  // // Update the proposal in the proposals collection
  const proposalRef = db.collection("proposals").doc(proposalID);
  const proposalSnapshot = await proposalRef.get();

  if (!proposalSnapshot.exists) {
    throw new Error("Proposal not found!");
  }

  // Retrieve the question data from the proposal document
  const proposalData = proposalSnapshot.data();

  // Get the proposal isDeleted status
  const proposalStatus = proposalData.isDeleted?.status || false;
  if (proposalStatus == true) {
    throw new Error("Proposal has been deleted!");
  }

  // Get question data
  const questions = proposalData.questions || [];

  // Find the question that matches the questionID
  const question = questions.find((q) => q.questionID === questionID);

  if (!question) {
    throw new Error("Question not found in proposal!");
  }

  // Restore question by updating fields
  question.isDeleted = {
    status: false,
    deletionDate: null,
    deletedBy: null,
  };

  // Update the question within the questions array
  const updatedQuestions = questions.map((q) =>
    q.questionID === questionID ? question : q
  );
  await proposalRef.update({ questions: updatedQuestions });

  // Delete the trash document
  await trashRef.delete();

  return "Question restored successfully!";
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

      //  document ID in the request body
      const { trashID } = req.body;

      const restoreResult = await restoreQuestionFromTrash(trashID);

      res.status(200).json({ message: restoreResult });
    } catch (error) {
      // console.error("Error handling restore request:", error);

      if (error.message.includes("not found")) {
        res.status(404).json({ error: error.message });
      } else if (error.message.includes("has been deleted")) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
