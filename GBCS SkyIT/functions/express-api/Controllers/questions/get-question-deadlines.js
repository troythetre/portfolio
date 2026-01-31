const { db } = require("../../firebase");

exports.getQuestionDeadlines = async function (req, res) {
  if (req.method === "GET") {
    try {
      const { proposalID, questionID } = req.params;

      // Retrieve the existing proposal document
      const proposalRef = db.collection("proposals").doc(proposalID);
      const proposalSnapshot = await proposalRef.get();

      // Check if the proposal document exists
      if (!proposalSnapshot.exists) {
        res.status(404).json({ message: "Proposal not found!" });
        return;
      }
      const existingProposal = proposalSnapshot.data();

      // Check if the proposal is tagged as deleted
      if (existingProposal.isDeleted && existingProposal.isDeleted.status) {
        res
          .status(400)
          .json({ message: "Cannot perform action on deleted proposal" });
        return;
      }

      // Find the index of the question within the questions array
      const questionIndex = existingProposal.questions.findIndex(
        (q) => q.questionID === questionID
      );

      // Check if the question exists in the proposal
      if (questionIndex === -1) {
        res.status(400).json({ message: "Question not found in proposal!" });
        return;
      }

      // Check if the question is tagged as deleted
      if (
        existingProposal.questions[questionIndex].isDeleted &&
        existingProposal.questions[questionIndex].isDeleted.status
      ) {
        res
          .status(400)
          .json({ message: "Cannot perform action on deleted question" });
        return;
      }

      // Find the review and write deadlines
      const deadlineEntry = {
        review_deadline:
          existingProposal.questions[questionIndex].review_deadline || "N/A",
        write_deadline:
          existingProposal.questions[questionIndex].write_deadline || "N/A",
      };

      res.status(200).json(deadlineEntry);
    } catch (error) {
      //console.error('Error getting question deadlines:', error);
      res.status(500).json({ error: "Error getting question deadlines" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
