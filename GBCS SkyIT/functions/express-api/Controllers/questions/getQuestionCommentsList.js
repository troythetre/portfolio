const { db } = require("../../firebase");

exports.getQuestionCommentList = async function (req, res) {
  if (req.method === "GET") {
    try {
      const { proposalID, questionID } = req.params;

      const proposalRef = db.collection("proposals").doc(proposalID);
      const proposalSnapshot = await proposalRef.get();

      if (!proposalSnapshot.exists) {
        res.status(404).json({ message: "Proposal not found!" });
        return;
      }

      const proposalData = proposalSnapshot.data();
      // Check if the proposal document was tagged as deleted
      if (proposalData.isDeleted.status == true) {
        res.status(400).json({ message: "Proposal has been deleted!" });
        return;
      }

      const questionIndex = proposalData["questions"].findIndex(
        (q) => q["questionID"] === questionID
      );

      if (questionIndex === -1) {
        res.status(404).json({ message: "Question not found in proposal!" });
        return;
      }
      // check if question is deleted
      if (proposalData["questions"][questionIndex].isDeleted.status) {
        res.status(400).json({ error: "Question is marked as deleted" });
        return;
      }

      const comments =
        proposalData["questions"][questionIndex]["comments"] || [];
      res.status(200).json({ comments: comments });
    } catch (error) {
      // console.error('Error getting question writers:', error);
      res.status(500).json({ error: "Error getting question writers" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
