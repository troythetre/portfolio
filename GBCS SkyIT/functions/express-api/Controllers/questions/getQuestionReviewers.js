const { db } = require("../../firebase");

exports.getQuestionReviewers = async function (req, res) {
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

      // Get the proposal isDeleted status
      const proposalStatus = existingProposal?.isDeleted?.status || false;

      if (proposalStatus == true) {
        res.status(400).json({ message: "Proposal has been deleted!" });
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

      // Get the question status
      const questionStatus =
        existingProposal.questions[questionIndex]?.isDeleted?.status || false;

      if (questionStatus == true) {
        res.status(400).json({ message: "Question has been deleted!" });
        return;
      }

      // get the question reviewers
      const reviewers = existingProposal.questions[questionIndex].reviewers;

      res.status(200).json({ ReviewersList: reviewers });
    } catch (error) {
      //console.error("Error getting question reviewers:", error);
      res.status(500).json({ error: "Error getting question reviewers" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
