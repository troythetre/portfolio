import { db, decodeToken } from "./firebase";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const bearerToken = req.headers.authorization?.split(" ")[1];

      if (!bearerToken) {
        res.status(401).json({ error: "Missing authentication token" });
        return;
      }

      // Verify the Firebase ID token and get the decoded token info
      const decodedToken = await decodeToken(bearerToken);

      console.log("Decoded Token:", decodedToken);

      if (!decodedToken || !decodedToken.email) {
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

      // Check if the proposal is tagged as deleted
      if (existingProposal.isDeleted.status) {
        res.status(400).json({ message: "Cannot mark/unmark a deleted proposal as bookmarked" });
        return;
      }

      // Check if the user's email is already in the bookmarkedBy array
      const isBookmarked = existingProposal.bookmarkedBy.includes(decodedToken.email);

      // Update the bookmarked status
      let updatedBookmarkedBy;
      if (isBookmarked) {
        updatedBookmarkedBy = existingProposal.bookmarkedBy.filter(email => email !== decodedToken.email);
      } else {
        updatedBookmarkedBy = [...existingProposal.bookmarkedBy, decodedToken.email];
      }

      // Update the proposal document with the modified bookmarked status
      await proposalRef.update({ bookmarkedBy: updatedBookmarkedBy });

      res.status(200).json({ message: "Bookmark status updated successfully!" });
    } catch (error) {
      console.error("Error updating bookmark status:", error);
      res.status(500).json({ error: "Error updating bookmark status" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}