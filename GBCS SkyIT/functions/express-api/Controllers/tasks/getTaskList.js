const { db } = require("../../firebase");

exports.getTaskList = async function(req, res) {
    if (req.method === "GET") {
        try {

            const userID = req.user.email;

            const taskRef = db.collection("tasks").doc(userID);
            const taskSnapshot = await taskRef.get();

            if (!taskSnapshot.exists) {
                // Task not found, return object with fields set as an error message.
                res.status(200).json({ error: "Task not found" });
                return;
            }

            const taskData = taskSnapshot.data();

            // Ensure 'approve', 'review', and 'answer' fields are present in each proposalID subdocument and set them as empty arrays if missing
            for (const proposalID in taskData) {
                taskData[proposalID].approve = taskData[proposalID].approve || [];
                taskData[proposalID].review = taskData[proposalID].review || [];
                taskData[proposalID].answer = taskData[proposalID].answer || [];
            }

            res.status(200).json(taskData);
        } catch (error) {
            // console.error("Error getting User Task List", error);
            res.status(500).json({ error: "Error getting Task List" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}