import { db, verifyToken, decodeToken } from "./firebase";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
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

            // Getting the logged in user's email from firebase
            const userEmail = decodedToken.email; 

            const proposalsSnapshot = await db.collection('proposals')
                .where("bookmarkedBy", "array-contains", userEmail)
                .where("isDeleted.status", "==", false)
                .get();

            const bookmarkedProposals = [];

            proposalsSnapshot.forEach((doc) => {
                const proposalData = doc.data();
                const { proposalID, name: proposalName, proposal_deadline: proposalDeadline, status: proposalStatus } = proposalData;
                
                bookmarkedProposals.push({
                    proposalID,
                    proposalName,
                    proposalDeadline,
                    proposalStatus
                });
            });

            // Send the bookmarked proposals as the response
            res.status(200).json({ proposals: bookmarkedProposals });
            
        } catch (error) {
           // console.error("Error retrieving proposals:", error);
            res.status(500).json({ error: "Error retrieving proposals" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
