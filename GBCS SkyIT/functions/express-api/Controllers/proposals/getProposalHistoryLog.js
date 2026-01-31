const { db } = require("../../firebase");

// Helper function to convert Firestore timestamp to readable date format
function formatDate(timestamp) {
    const milliseconds = timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000;
    const date = new Date(milliseconds);

    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

exports.getProposalHistoryLog = async function (req, res) {
  if (req.method === "GET") {
    try {
      const { proposalID } = req.params;

      // Retrieve the existing proposal document to check its status
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

      // Fetch the history log entries for the specified proposal
      const historyLogRef = db.collection("historyLog").doc(proposalID);
      const historyLogSnapshot = await historyLogRef.get();

      if (!historyLogSnapshot.exists) {
        res.status(404).json({ message: "History log not found for the proposal!" });
        return;
      }

      // Directly get the data from the historyLogSnapshot
      const historyLogData = {
        id: historyLogSnapshot.id,
        ...historyLogSnapshot.data()
      };

      // Format each actionDate within the entries array
      if (historyLogData.entries) {
        historyLogData.entries.forEach(entry => {
          if (entry.actionDate) {
            entry.actionDate = formatDate(entry.actionDate);
          }
        });
      }

      res.status(200).json(historyLogData);
    } catch (error) {
      //console.error("Error getting proposal history log:", error);
      res.status(500).json({ error: "Error getting proposal history log" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};

