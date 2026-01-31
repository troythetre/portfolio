const { db } = require("../../firebase");

exports.getAllAuthCodes = async function (req, res) {
  // Check if the request methods is GET
  if (req.method === "GET") {
    try {
      // Get authCodes collection from the database
      const AuthCodesSnapshot = await db.collection("authCodes").get();

      // Array to store all the authCodes generated.
      const AuthCodes = [];

      // Iterate over all the authCode
      AuthCodesSnapshot.forEach((doc) => {
        // Get details of the authCodes
        const AuthCodeData = doc.data();
        const code = AuthCodeData.code;
        const createdBy = AuthCodeData.createdBy;
        const createdAt = AuthCodeData.createdAt.toDate().toISOString();
        const status = AuthCodeData.status;
        const usedAt = AuthCodeData.usedAt;
        const usedBy = AuthCodeData.usedBy;
        const usedFor = AuthCodeData.usedFor;

        // Store the authcode into the array
        if (AuthCodes) {
          AuthCodes.push({
            code: code,
            createdBy: createdBy,
            usedBy: usedBy,
            createdAt: createdAt,
            status: status,
            usedAt: usedAt,
            usedFor: usedFor,
          });
        }
      });

      res.status(200).json({ AuthCodes });
    } catch (error) {
      console.error("Error getting all auth codes:", error);
      res.status(500).json({ error: "Error getting all auth codes" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
