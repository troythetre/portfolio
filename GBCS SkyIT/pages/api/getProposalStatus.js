import { db, verifyToken } from "./firebase";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const bearerToken = req.headers.authorization ?.split(" ")[1];

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
            const proposalRef = db.collection('proposals').doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: 'Proposal not found!' });
                return;
            }

            // Check if the proposal is tagged as deleted
            const isDeleted = proposalSnapshot.data().isDeleted.status;

            if (isDeleted) {
                res.status(400).json({ message: 'Proposal has been deleted' });
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
}
