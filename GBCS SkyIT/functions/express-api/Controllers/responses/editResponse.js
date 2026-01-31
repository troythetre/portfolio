const { db } = require("../../firebase");

exports.editResponse = async function(req, res) {
    // put request to update proposal
    if (req.method === "PUT") {
        try {

            const { responseID, answer, question, software, topic, subtopic } = req.body;

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
                res.status(400).json({ message: 'Response is deleted!' });
                return;
            }

            //function to update responses if available 
            updateResponse(responseData, answer, question, software, topic, subtopic);

            //update database with new data 
            await responseRef.set(responseData);

            //return success message
            res.status(200).json({ message: " Response data updated successfully!" });


        } catch (error) {
            //console.error("Error updating response:", error);
            res.status(500).json({ error: "Error updating response" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

function updateResponse(data, answer, question, software, topic, subtopic) {
    if (answer) {
        data.answer = answer;
    }
    if (software) {
        data.software = software;
    }
    if (topic) {
        data.topic = topic;
    }
    if (subtopic) {
        data.subtopic = subtopic;
    }
    if (question) {
        data.question = subtopic;
    }
}