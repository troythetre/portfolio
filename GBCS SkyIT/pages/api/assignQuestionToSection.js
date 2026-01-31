import { db, verifyToken } from "./firebase";

async function checkExistenceAndDeletionStatus(payload, proposalSnapshot) {
  const { proposalID, questionID, sectionID } = payload;

  // Check if the proposal document exists
  if (!proposalSnapshot.exists) {
    throw new Error("Proposal not found!");
  }

  // Get the existing proposal data
  const existingProposal = proposalSnapshot.data();

  // Check if the proposal document was tagged as deleted
  if (existingProposal.isDeleted?.status == true) {
    throw new Error("Proposal has been deleted!");
  }

  // Check questionID exist
  const questionIndex = existingProposal.questions.findIndex(
    (q) => q.questionID === questionID
  );

  if (questionIndex == -1) {
    throw new Error(`Question not found in Proposal ${proposalID}.`);
  }

  // Check if the question was tagged as deleted
  if (existingProposal.questions[questionIndex].isDeleted?.status == true) {
    throw new Error("Question has been deleted!");
  }

  // Check sectionID exist
  const sectionIndex = existingProposal.sections.findIndex(
    (s) => s.sectionID === sectionID
  );

  if (sectionIndex == -1) {
    throw new Error(`Section not found in Proposal ${proposalID}.`);
  }

  // Check if the section was tagged as deleted
  if (existingProposal.sections[sectionIndex].isDeleted?.status == true) {
    throw new Error("Section has been deleted!");
  }
}

async function assignQuestionToSection(payload) {
  const { proposalID, questionID, sectionID } = payload;

  // Check proposalID exist
  const proposalRef = db.collection("proposals").doc(proposalID);
  const proposalSnapshot = await proposalRef.get();

  // Check if valid and deleted status for proposal Id, question Id, section Id
  await checkExistenceAndDeletionStatus(payload, proposalSnapshot);

  // Get the existing proposal data
  const existingProposal = proposalSnapshot.data();

  // Check questionID exist
  const questionIndex = existingProposal.questions.findIndex(
    (q) => q.questionID === questionID
  );

  // Check sectionID exist
  const sectionIndex = existingProposal.sections.findIndex(
    (s) => s.sectionID === sectionID
  );

  // Check if sectionID is not empty
  const questionSectionID = existingProposal.questions[questionIndex].sectionID;

  if (questionSectionID && questionSectionID !== sectionID) {
    // Find the section with the matching sectionID
    const sIdx = existingProposal.sections.findIndex(
      (s) => s.sectionID === questionSectionID
    );

    // Check status of section
    if (sIdx === -1) {
      throw new Error(`Section not found in Proposal ${proposalID}.`);
    }

    const section = existingProposal.sections[sIdx];
    if (section.isDeleted?.status) {
      throw new Error("Section has been deleted!");
    }

    // Remove questionID from section
    existingProposal.sections[sIdx].questions = section.questions.filter(
      (qID) => qID !== questionID
    );
  }

  // Add section ID into question filed
  existingProposal.questions[questionIndex].sectionID = sectionID;

  // Add question ID into question array of section filed
  if (existingProposal.sections[sectionIndex].questions.includes(questionID)) {
    throw new Error(
      `Section ${sectionID} has already connected with ${questionID}`
    );
  }

  existingProposal.sections[sectionIndex].questions.push(questionID);

  // Update proposal Ref
  await proposalRef.set(existingProposal);

  // Return Json message
  return "Assign Question Successfully!";
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

      const restoreResult = await assignQuestionToSection(req.body);

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
