import { db, verifyToken } from "./firebase";

async function restoreProposalFromTrash(trashID) {
    try {
        const trashRef = db.collection("trash").doc(trashID);
        const trashSnapshot = await trashRef.get();

        if (!trashSnapshot.exists) {
            return "TrashID not found";
        }

        const itemType = trashSnapshot.data().itemType;

        // Check if the itemType is "proposal"
        if (itemType !== "proposal") {
            return "Restoration info is for proposal only";
        }

        const restorationInfo = trashSnapshot.data().restorationInfo;
        const proposalID = restorationInfo.proposalID;

        // Update proposal in the proposals collection in DB.
        const proposalRef = db.collection("proposals").doc(proposalID);
        const proposalSnapshot = await proposalRef.get();

        if (!proposalSnapshot.exists) {
            return "Proposal not found";
        }

        // Restore proposal by updating fields
        await proposalRef.update({
            "isDeleted.status": false,
            "isDeleted.deletionDate": null,
            "isDeleted.deleteBy": null,
        });

        // Delete the trash document from trash collection
        await trashRef.delete();

        return "Proposal restored successfully and TrashID deleted.";
    } catch (error) {
        console.error("Error restoring proposal from trash collection:", error);
        throw error;
    }
}

export default async function handler(req, res) {
    if (req.method === "PUT") {
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

            // Extract trashID from the request body
            const { trashID } = req.body;

            const restoreResult = await restoreProposalFromTrash(trashID);

            res.status(200).json({ message: restoreResult });
        } catch (error) {
            console.error("Error handling restore request:", error);
            res.status(500).json({ error: "Error processing restore request" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
