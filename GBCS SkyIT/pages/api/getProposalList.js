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

            // Retrieve all proposals from the database, excluding deleted ones
            const proposalsSnapshot = await db.collection('proposals')
                .where("isDeleted.status", "==", false)
                .get();

            const proposals = [];

            proposalsSnapshot.forEach((doc) => {
                const proposal = {
                    proposalID: doc.id,
                    ...doc.data()
                };

                // Exclude questions from deleted proposals
                proposal.questions = proposal.questions.filter((question) =>
                    question.hasOwnProperty("isDeleted") && !question.isDeleted.status
                );

                proposals.push(proposal);
            });

            res.status(200).json({ proposals });
        } catch (error) {
            console.error("Error retrieving proposals:", error);
            res.status(500).json({ error: "Error retrieving proposals" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
