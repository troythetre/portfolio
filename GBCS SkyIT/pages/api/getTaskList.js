import { db, decodeToken,verifyToken } from "./firebase";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const bearerToken = req.headers.authorization?.split(" ")[1];

      if (!bearerToken) {
        res.status(401).json({ error: "Missing authentication token" });
        return;
      }
      const isTokenValid = await verifyToken(bearerToken);

            if (!isTokenValid) {
                res.status(401).json({ error: "Invalid authentication token" });
                return;
            }

      const decodedToken = await decodeToken(bearerToken);

      console.log("Decoded Token:", decodedToken);

      if (!decodedToken || !decodedToken.email) {
        res.status(401).json({ error: "Invalid authentication token" });
        return;
      }

      const userID = decodedToken.email;

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
      console.error("Error getting User Task List", error);
      res.status(500).json({ error: "Error getting Task List" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
