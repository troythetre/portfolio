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

           const { responseID } = req.body;

            // get response from the database
            const responseRef = db.collection('responses').doc(responseID);
            const responseSnapshot = await responseRef.get();
            
            // Check if response is in database
            if (!responseSnapshot.exists) {
                res.status(404).json({ message: 'Response ID not found!' });
                return;
            }
            
            const responseData = responseSnapshot.data();

            //Check if the response is marked as deleted
            if (responseData.hasOwnProperty("isDeleted") && responseData.isDeleted.status) {
                res.status(404).json({ message: 'Response is deleted!' });
                return;
            }

            res.status(200).json({ responseID, responseData });
        } catch (error) {
            console.error("Error retrieving responses:", error);
            res.status(500).json({ error: "Error retrieving responses" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}