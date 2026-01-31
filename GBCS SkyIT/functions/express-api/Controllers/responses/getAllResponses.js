const { db } = require("../../firebase");

exports.getAllResponses = async function(req, res) {
    if (req.method === "GET") {
        try {
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
            //console.error("Error retrieving responses:", error);
            res.status(500).json({ error: "Error retrieving responses" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}