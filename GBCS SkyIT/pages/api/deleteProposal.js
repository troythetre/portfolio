import { db, verifyToken, decodeToken } from "./firebase"; // Import your Firebase and decode token functions

async function moveProposalToTrash(proposalID, userEmail, reason) {
  try {
    const proposalRef = db.collection("proposals").doc(proposalID);

    // Check if the proposal exists
    const proposalSnapshot = await proposalRef.get();
    if (!proposalSnapshot.exists) {
      return "Proposal not found";
    }

    // Update proposal to mark it as deleted and set deletedBy field
    await proposalRef.update({
      "isDeleted.status": true,
      "isDeleted.deletionDate": new Date(),
      "isDeleted.deleteBy": userEmail,
    });

    // Create a new document in the trash collection with an auto-generated reference
    const trashReason = reason ? reason : "No reason left";
    const trashDocRef = await db.collection("trash").add({
      itemType: "proposal",
      reasonForDeletion: trashReason,
      restorationInfo: { proposalID },
      deletedAt: new Date(),
      deletedBy: userEmail, // Add the deletedBy field with user's email
    });

    return { message: "Proposal moved to trash!", trashRef: trashDocRef.id };
  } catch (error) {
    console.error("Error moving proposal to trash:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === "DELETE") {
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

      const decodedToken = await decodeToken(bearerToken);

      if (!decodedToken || !decodedToken.email) {
        res.status(401).json({ error: "Invalid authentication token" });
        return;
      }

      const userEmail = decodedToken.email;

      const { proposalID, reason } = req.body;

      const proposalRef = db.collection("proposals").doc(proposalID);
      const proposalSnapshot = await proposalRef.get();

      if (!proposalSnapshot.exists) {
        res.status(404).json({ error: "Proposal not found" });
        return;
      }

      const isDeleted = proposalSnapshot.data().isDeleted;

      if (isDeleted && isDeleted.status) {
        res.status(400).json({ message: "Proposal is in trash" });
        return;
      }

      const moveResult = await moveProposalToTrash(proposalID, userEmail, reason);
      res.status(200).json(moveResult);
    } catch (error) {
      console.error("Error handling delete request:", error);
      res.status(500).json({ error: "Error processing delete request" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

