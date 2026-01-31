import { db, verifyToken } from "./firebase";


export default async function handler(req, res) {
  if (req.method === "GET") {
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

      const { proposalID } = req.body;

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
        res.status(404).json({ message: "Proposal has been deleted!" });
        return;
      }
      res.status(200).json({ milestones: existingProposal.milestones });
    } catch (error) {
      //console.error("Error getting milestone list:", error);
      res.status(500).json({ error: "Error getting milestone list" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
