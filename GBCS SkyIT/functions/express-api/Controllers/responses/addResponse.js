const { db } = require("../../firebase");
exports.addResponse = async function(req, res) {
    if (req.method === "POST") {
        try {
            const { question, answer, software, topic, subtopic } = req.body;
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


        } catch (error) {
            //console.error("Error adding response:", error);
            res.status(500).json({ error: "Error adding response" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}