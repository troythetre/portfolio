const { db } = require("../../firebase");

exports.statusNotes = async function (req, res) {
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
      if (
        !existingProposal.hasOwnProperty("statusChangeNotes") ||
        !Array.isArray(existingProposal.statusChangeNotes)
      ) {
        res
          .status(404)
          .json({ error: "Status notes array not found in the proposal" });
        return;
      }
      const sortedStatusNotes = existingProposal.statusChangeNotes
        .sort((a, b) => b.date._seconds - a.date._seconds) // Sort by seconds
        .map((statusNote) => ({
          ...statusNote,
          date: new Date(statusNote.date._seconds * 1000), // Convert Firestore Timestamp to Date
        }));

      res.status(200).json({ statusNotes: sortedStatusNotes });
    } catch (error) {
      //console.error("Error getting question status:", error);
      res.status(500).json({ error: "Error getting  status notes" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
