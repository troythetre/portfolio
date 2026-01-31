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

            // Retrieve all items from the "trash" collection
            const trashItemsSnapshot = await db.collection('trash').get();
            const trashItems = [];

            trashItemsSnapshot.forEach((doc) => {
                const trashItem = {
                    trashID: doc.id, // Include trashID in the returned data
                    ...doc.data()
                };
                trashItems.push(trashItem);
            });

            res.status(200).json({ trashItems });
        } catch (error) {
            console.error("Error retrieving trash items:", error);
            res.status(500).json({ error: "Error retrieving trash items" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
