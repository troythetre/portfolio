import { db, decodeToken } from "./firebase"; 
import { PROPOSAL_STATUS } from "./voopConstants";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      // Verify user authentication and admin role
      const bearerToken = req.headers.authorization?.split(" ")[1];

      if (!bearerToken) {
        res.status(401).json({ error: "Missing authentication token" });
        return;
      }

      // Verify the Firebase ID token and get the decoded token info
      const decodedToken = await decodeToken(bearerToken);

      if (!decodedToken || !decodedToken.email) {
        res.status(401).json({ error: "Invalid authentication token" });
        return;
      }

      // Attempt to retrieve the approver user from the database
      const findUser = await db
        .collection("users")
        .where("email", "==", decodedToken.email)
        .get();

      const userRecord = findUser.docs[0]?.data();

      if (userRecord?.hasOwnProperty("role") && userRecord.role === "admin") {
        const { proposalID, status, note } = req.body;
        const proposalDoc = await db
          .collection("proposals")
          .doc(proposalID)
          .get();

        if (!proposalDoc.exists) {
          res.status(404).json({ error: "Proposal not found" });
          return;
        }
        const proposalData = proposalDoc.data();

        // Check if the proposal is deleted
        if (proposalData.isDeleted?.status) {
          res
            .status(400)
            .json({ error: "Cannot update status of deleted proposal" });
          return;
        }

        if (!Object.values(PROPOSAL_STATUS).includes(status.toLowerCase())) {
          res.status(400).json({ error: "Invalid status" });
          return;
        }

        // Update the proposal's status and status notes
        proposalData.statusChangeNotes.push({
          date: new Date(),
          note: note || "",
          status: status.toLowerCase(),
          updatedBy: decodedToken.email,
        });

        const updateData = {
          statusChangeNotes: proposalData.statusChangeNotes,
          status: status.toLowerCase(),
        };

        // If the proposal is rejected, mark it as archived
        if (status.toLowerCase() === "rejected") {
          updateData.isArchived = true; // Add an 'isArchived' flag
          updateData.archivedAt = new Date(); // Optional: Add a timestamp
        }

        await proposalDoc.ref.update(updateData);

        res.status(200).json({ message: "Proposal status updated successfully" });
      } else {
        res.status(400).json({ error: "Only Admin can Approve this Proposal" });
      }
    } catch (error) {
      console.error("Error updating proposal status:", error);
      res.status(500).json({ error: "Error updating proposal status" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
