const { db } = require("../../firebase");

exports.getQuestionWritersList = async function (req, res) {
  if (req.method === "GET") {
    try {
      const { proposalID, questionID } = req.params;

      if (!proposalID || !questionID) {
        res
          .status(400)
          .json({ error: "proposalID and questionID are required" });
        return;
      }
      // Retrieve the proposal document
      const proposalRef = db.collection("proposals").doc(proposalID);
      const proposalDoc = await proposalRef.get();

      if (!proposalDoc.exists) {
        res.status(404).json({ error: "Proposal not found" });
        return;
      }

      // Retrieve the question data from the proposal document
      const proposalData = proposalDoc.data();

      // Get the proposal isDeleted status
      const proposalStatus = proposalData.isDeleted.status || false;
      if (proposalStatus == true) {
        res.status(400).json({ error: "Proposal has been deleted" });
        return;
      }

      const questions = proposalData.questions || [];

      // Find the question that matches the questionID
      const question = questions.find((q) => q.questionID === questionID);

      if (!question) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      // Get the question status
      const questionStatus = question.isDeleted.status || false;

      if (questionStatus == true) {
        res.status(400).json({ error: "Question has been deleted" });
        return;
      }

      const writers = question.writers || [];
      res.status(200).json({ writers });
    } catch (error) {
      // console.error('Error getting question writers:', error);
      res.status(500).json({ error: "Error retrieving question writers" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
