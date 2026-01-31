const { db } = require("../../firebase");

exports.milestones = async function (req, res) {
  if (req.method === "GET") {
    try {
      const { proposalID } = req.params;
      // Retrieve the existing proposal document
      const proposalRef = db.collection("proposals").doc(proposalID);
      const proposalSnapshot = await proposalRef.get();

      // Check if the proposal document exists
      if (!proposalSnapshot.exists) {
        res.status(404).json({ message: "Proposal not found!" });
        return;
      }
      const existingProposal = proposalSnapshot.data();

      // Check if the proposal itself is tagged as deleted
      if (existingProposal.isDeleted && existingProposal.isDeleted.status) {
        res.status(400).json({ message: "Proposal has been deleted!" });
        return;
      }
      res.status(200).json({ milestones: existingProposal.milestones });
    } catch (error) {
      console.error("Error getting milestone list:", error);
      res.status(500).json({ error: "Error getting milestone list" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
