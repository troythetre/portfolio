import { db, decodeToken } from "./firebase";

export default async function handler(req, res) {
    // put request to update proposal
    if (req.method === "PUT") {
        try {
            const bearerToken = req.headers.authorization?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }

            const decodedToken = await decodeToken(bearerToken);

            if (!decodedToken || !decodedToken.email) {
                res.status(401).json({ error: "Invalid authentication token" });
                return;
                }


            const { responseID, answer,question, software, topic, subtopic } = req.body;


            // try to find user in db
            const findUser = await db
                .collection("users")
                .where("email", "==", decodedToken.email)
                .get();

            if (!findUser.empty) {
                // Assuming email is unique, get the user data
                const userRecord = findUser.docs[0].data();

                //check if the user is an admin
                if (
                    userRecord.hasOwnProperty("role") &&
                    userRecord.role === "admin") {
                   
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

                    //function to update responses if available 
                    updateResponse(responseData, answer,question, software, topic, subtopic);
                    
                    //update database with new data 
                    await responseRef.set(responseData);

                    //return success message
                    res.status(200).json({ message: " Response data updated successfully!" });
                    return;

                } else {
                    res
                        .status(400)
                        .json({ error: "Only Admins can update responses" });
                    return;
                }
                } else {
                    res.status(404).json({ error: "User not found" });
                    return;
                }
        
        } catch (error) {
            console.error("Error updating response:", error);
            res.status(500).json({ error: "Error updating response" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

function updateResponse(data, answer,question, software, topic, subtopic) {
    if(answer) {
        data.answer = answer;
    }
    if(software) {
        data.software = software;
    }
    if(topic) {
        data.topic = topic;
    }
    if(subtopic) {
        data.subtopic = subtopic;
    }
     if(question) {
        data.question = subtopic;
    }
}
