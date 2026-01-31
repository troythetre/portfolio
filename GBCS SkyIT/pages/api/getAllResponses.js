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

            // Retrieve responses from the database
            const responsesRef = db.collection("responses");
            const responsesSnapshot = await responsesRef.where("isDeleted.status", "==", false).get();

            const responses = [];

            responsesSnapshot.forEach((doc) => {
                const responseID = doc.id;
                const responseData = doc.data();
                responses.push({ responseID, ...responseData });
            });

            res.status(200).json({ responses });
        } catch (error) {
            console.error("Error retrieving responses:", error);
            res.status(500).json({ error: "Error retrieving responses" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
