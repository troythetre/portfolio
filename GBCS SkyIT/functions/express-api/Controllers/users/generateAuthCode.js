const { db } = require("../../firebase");
const { v4: uuidv4 } = require("uuid");
const { AUTH_CODE_STATUS } = require("../../voopConstants");

exports.generateAuthCode = async function (req, res) {
  // Check if the request method is POST
  if (req.method === "POST") {
    try {
      // Generate the auth code by uuid to ensure uniqueness 
      const authCode = uuidv4();

      // Deails of new auth code entry
      const newAuthCodeEntry = {
        // Auth code
        code: authCode,
        // creator's email address
        createdBy: req.user.email,
        // Should be filled in with the user's email address once code is being used
        usedBy: "",
        // Current time when code is being generated
        createdAt: new Date(),
        // Should be filled in with the time when code is being used
        usedAt: null,
        // Indicate the purpose of using the code
        usedFor: "",
        // Update to AUTH_CODE_STATUS.UNAVAILABLE after used
        status: AUTH_CODE_STATUS.AVAILABLE,
      };

      // Store the new auth code in the 'authCodes' collection
      await db.collection("authCodes").doc(authCode).set(newAuthCodeEntry);

      res.status(200).json({
        message: "Auth code generated successfully!",
        code: authCode,
        createdBy: req.user.email,
        createdAt: newAuthCodeEntry.createdAt,
        status: newAuthCodeEntry.status,
      });
    } catch (error) {
      console.error("Error creating auth code:", error);
      res.status(500).json({ error: "Error creating auth code" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
