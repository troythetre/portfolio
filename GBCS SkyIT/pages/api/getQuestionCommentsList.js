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

            const { proposalID, questionID } = req.body;

            const proposalRef  = db.collection("proposals").doc(proposalID);
            const proposalSnapshot  = await proposalRef.get();

            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: 'Proposal not found!' });
                return;
            }

            const proposalData = proposalSnapshot.data();
            const questionIndex = proposalData["questions"].findIndex(q => q["questionID"] === questionID);

            if (questionIndex === -1) {
                res.status(404).json({message: 'Question not found in proposal!'});
                return;
            }

            const comments = proposalData["questions"][questionIndex]["comments"] || [];
            res.status(200).json({ comments: comments });

        } catch (error) {
            console.error('Error getting question writers:', error);
            res.status(500).json({ error: 'Error getting question writers' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
