const { db } = require("../../firebase");

exports.proposalStatus = async function (req, res) {
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

      // Check if the proposal is tagged as deleted
      const isDeleted = proposalSnapshot.data().isDeleted.status;

      if (isDeleted) {
        res.status(400).json({ message: "Proposal has been deleted" });
        return;
      }

      // Get the proposal status
      const status = proposalSnapshot.data().status;

      res.status(200).json({ status: status });
    } catch (error) {
      //console.error("Error getting proposal status:", error);
      res.status(500).json({ error: "Error getting proposal status" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
