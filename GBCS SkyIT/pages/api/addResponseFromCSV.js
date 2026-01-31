import { db, decodeToken } from "./firebase";
import multer from "multer";

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export default async function handler(req, res) {
  // Check for the correct Content-Type header
  if (
    !req.headers["content-type"] ||
    !req.headers["content-type"].includes("multipart/form-data")
  ) {
    res.status(400).json({
      error:
        "Invalid Content-Type header. Use 'multipart/form-data' for file uploads",
    });
    return;
  }

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

      // Check if the user has an admin role
      const userQuerySnapshot = await db
        .collection("users")
        .where("email", "==", decodedTokenInfo.email)
        .get();

      if (userQuerySnapshot.empty) {
        res.status(401).json({ error: "User not authorized" });
        return;
      }

      const userData = userQuerySnapshot.docs[0].data();

      if (!userData.hasOwnProperty("role") || userData.role !== "admin") {
        res.status(403).json({ error: "Only admins can perform this action" });
        return;
      }

      // Handle file upload
      upload.single("csvfile")(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading
          return res.status(400).json({
            error:
              "File upload error. Please upload key 'csvfile' with a CSV file.",
          });
        }

        if (err || !req.file) {
          // An unknown error occurred when uploading
          // console.error("Unknown error:", err);
          return res.status(500).json({ error: "Invalid file upload" });
        }

        if (!req.file.originalname.match(/\.(csv)$/)) {
          return res
            .status(400)
            .json({ error: "Invalid file format. Please upload a CSV file." });
        }

        // File upload was successful, and the CSV file is available in req.file.buffer
        const csvData = req.file.buffer.toString("utf8");
        const requiredColumns = [
          "question",
          "answer",
          "software",
          "topic",
          "subtopic",
        ];

        // Header checking and Remove empty string rows
        const csvRows = csvData
          .split("\n")
          .map((row) => row.trim())
          .filter((row) => row !== "");

        const headers = csvRows[0].split(",");

        const isValidHeaders = requiredColumns.every((column) =>
          headers.some((header) => header.trim().toLowerCase() === column)
        );

        if (!isValidHeaders) {
          return res.status(400).json({
            error:
              "CSV file is missing required columns, required: [ 'question', 'answer', 'software', 'topic', 'subtopic' ].",
          });
        }

        if (csvRows.length < 2) {
          return res.status(400).json({
            error: "CSV file is missing rows.",
          });
        }

        // Process each row of data
        const responseArray = [];
        for (let i = 1; i < csvRows.length; i++) {
          const row = csvRows[i].split(",");

          if (row[0] && row[1] && row[2] && row[3] && row[4]) {
            responseArray.push({
              question: row[0],
              answer: row[1],
              software: row[2],
              topic: row[3],
              subtopic: row[4],
              isDeleted: {
                deletionDate: null,
                deletedBy: null,
                status: false,
              },
            });
          }
        }

        const responseIDs = [];
        // Add responseArray to the database
        // Generate a new responseID using Firebase autoID
        if (responseArray.length > 0) {
          // Create a new batch
          const batch = db.batch();

          // Reference to the "responses" collection
          const responsesCollectionRef = db.collection("responses");

          // Iterate over the responseArray and add each document to the batch
          responseArray.forEach((response) => {
            const responseDocRef = responsesCollectionRef.doc();

            responseIDs.push(responseDocRef.id);

            // Set data in the document
            batch.set(responseDocRef, response);
          });

          try {
            // Commit the batched write
            await batch.commit();
            // console.log("Batch write successful");
          } catch (error) {
            // console.error("Error committing batch write:", error);
            res
              .status(500)
              .json({ error: "Error adding responses to the database" });
            return;
          }
        }

        res.status(200).json({
          message: "File uploaded and processed successfully",
          responseIDs,
        });
      });
    } catch (error) {
      // console.error("Error adding responses from CSV:", error);
      res.status(500).json({ error: "Error adding responses from CSV" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
