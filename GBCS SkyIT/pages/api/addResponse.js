import { db, decodeToken } from "./firebase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const bearerToken = req.headers.authorization?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }

            // Verify the Firebase ID token and get the decoded token info
            const decodedTokenInfo = await decodeToken(bearerToken);

            if (!decodedTokenInfo || !decodedTokenInfo.email) {
                res.status(401).json({ error: "Invalid authentication token" });
                return;
            }

            const { question, answer, software, topic, subtopic } = req.body;

            // Fetch the user document based on the email from the decoded token
            const userQuerySnapshot = await db
                .collection("users")
                .where("email", "==", decodedTokenInfo.email)
                .get();

            // Check if a user document was found
            if (!userQuerySnapshot.empty) {
                // Assuming email is unique, get the user data from the first document
                const userData = userQuerySnapshot.docs[0].data();

                // Check if the user has an admin role
                if ( userData.hasOwnProperty("role") &&
                    userData.role === "admin") {
        
                    // Generate a new responseID using Firebase autoID
                    const responseRef = db.collection("responses").doc();
                    const responseID = responseRef.id;

                    // Create the response object
                    const newResponse = {
                        question,
                        answer,
                        software,
                        topic,
                        subtopic,
                        isDeleted: {
                            deletionDate: "",
                            deletedBy: "",
                            status: false
                        }
                    };

                    // Add the new response to the database
                    await responseRef.set(newResponse);

                    res.status(200).json({ message: "Response added successfully", responseID });
                    


                } else {
                res.status(403).json({ error: "Only admins can perform this action" });
                }

            } else {
            res.status(401).json({ error: "User not authorized" });
            }


            
        } catch (error) {
            console.error("Error adding response:", error);
            res.status(500).json({ error: "Error adding response" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

