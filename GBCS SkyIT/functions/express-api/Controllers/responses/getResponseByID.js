const { db } = require("../../firebase");

exports.getSingeResponse = async function (req, res) {
  if (req.method === "GET") {
    try {
      const { responseID } = req.params;

      // get response from the database
      const responseRef = db.collection("responses").doc(responseID);
      const responseSnapshot = await responseRef.get();

      // Check if response is in database
      if (!responseSnapshot.exists) {
        res.status(404).json({ message: "Response ID not found!" });
        return;
      }

      const responseData = responseSnapshot.data();

      //Check if the response is marked as deleted
      if (
        responseData.hasOwnProperty("isDeleted") &&
        responseData.isDeleted.status
      ) {
        res.status(400).json({ message: "Response is deleted!" });
        return;
      }

      res.status(200).json({ responseID, responseData });
    } catch (error) {
      //console.error("Error retrieving responses:", error);
      res.status(500).json({ error: "Error retrieving responses" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
