import { db, verifyToken } from "./firebase";

// Check proposal and sections
async function checkExistenceAndDeletionStatus(payload, proposalSnapshot) {
  const { proposalID, originalSectionID, updatedSectionID } = payload;

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

  // Check sectionID exist
  const [originalSectionIndex, updatedSectionIndex] =
    existingProposal.sections.reduce(
      (indices, s, index) => {
        if (s.sectionID === originalSectionID) indices[0] = index;
        if (s.sectionID === updatedSectionID) indices[1] = index;
        return indices;
      },
      [-1, -1]
    );

  if (originalSectionIndex == -1 || updatedSectionIndex == -1) {
    throw new Error(`Section not found in Proposal ${proposalID}.`);
  }

  // Check if the section was tagged as deleted
  if (
    existingProposal.sections[originalSectionIndex].isDeleted?.status == true
  ) {
    throw new Error(`Section ${originalSectionID} has been deleted!`);
  }

  if (
    existingProposal.sections[updatedSectionIndex].isDeleted?.status == true
  ) {
    throw new Error(`Section ${updatedSectionID} has been deleted!`);
  }
}

// Check questions
async function checkQuestionsStatus(proposal, questionIDs) {
  if (questionIDs.length === 0) {
    throw new Error("No Questions into the original section!");
  }

  const missingQuestionID = questionIDs.find(
    (questionID) => !proposal.questions.some((q) => q.questionID === questionID)
  );

  if (missingQuestionID) {
    throw new Error(`Question not found in Proposal ${proposal.proposalID}.`);
  }
}

async function reassignQuestionsToSection(payload) {
  const { proposalID, originalSectionID, updatedSectionID } = payload;

  // Check proposalID exist
  const proposalRef = db.collection("proposals").doc(proposalID);
  const proposalSnapshot = await proposalRef.get();

  // Check if valid and deleted status for proposal Id, sections
  await checkExistenceAndDeletionStatus(payload, proposalSnapshot);

  // Get the existing proposal data
  const existingProposal = proposalSnapshot.data();

  // Get questions from originalSectionID
  const originalSectionIndex = existingProposal.sections.findIndex(
    (s) => s.sectionID === originalSectionID
  );

  const originalSectionQuestions =
    existingProposal.sections[originalSectionIndex].questions;

  // Check all questions from s1 are valid
  await checkQuestionsStatus(existingProposal, originalSectionQuestions);

  // Get questions from updatedSectionID
  const updatedSectionIndex = existingProposal.sections.findIndex(
    (s) => s.sectionID === updatedSectionID
  );

  const updatedSectionQuestions =
    existingProposal.sections[updatedSectionIndex].questions;

  // Add all questions from s1 into s2
  // Update SectionID of QuestionID from s1 to s2
  // Skip if questionID has already exist in s2
  const updatedQuestionIDsSet = new Set(updatedSectionQuestions);

  // If question is tagged as deleted then skip
  originalSectionQuestions.forEach((questionID) => {
    const index = questions.findIndex((q) => q.questionID === questionID);

    // check questionID if being deleted
    if (
      index != -1 &&
      !updatedQuestionIDsSet.has(questionID) &&
      !existingProposal.questions[index].isDeleted.status
    ) {
      // Update sectionID of questionID with updatedSectionID
      const questionIndex = existingProposal.questions.findIndex(
        (q) => q.questionID === questionID
      );
      existingProposal.questions[questionIndex].sectionID = updatedSectionID;

      updatedQuestionIDsSet.add(questionID);
      updatedSectionQuestions.push(questionID);
    }
  });

  existingProposal.sections[updatedSectionIndex].questions =
    updatedSectionQuestions;

  // Remove questions from s1
  existingProposal.sections[originalSectionIndex].questions = [];

  // Update proposal Ref
  await proposalRef.set(existingProposal);

  // Return Json message
  return "Reassign Questions Successfully!";
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

      const restoreResult = await reassignQuestionsToSection(req.body);

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
