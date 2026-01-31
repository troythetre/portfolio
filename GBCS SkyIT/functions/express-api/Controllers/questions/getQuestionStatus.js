const { db } = require("../../firebase");

exports.getQuestionStatus = async function (req, res) {
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
      if (existingProposal.isDeleted.status) {
        res
          .status(400)
          .json({
            message: "Cannot get question status for a deleted proposal",
          });
        return;
      }

      // Find the index of the question within the questions array
      const questionIndex = existingProposal.questions.findIndex(
        (q) => q.questionID === questionID
      );

      // Check if the question exists in the proposal
      if (questionIndex === -1) {
        res.status(404).json({ message: "Question not found in proposal!" });
        return;
      }

      // Check if the question is tagged as deleted
      if (existingProposal.questions[questionIndex].isDeleted.status) {
        res
          .status(400)
          .json({ message: "Cannot get status for a deleted question" });
        return;
      }

      // Get the question status
      const status = existingProposal.questions[questionIndex].status;

      res.status(200).json({ status: status });
    } catch (error) {
      //console.error("Error getting question status:", error);
      res.status(500).json({ error: "Error getting question status" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
