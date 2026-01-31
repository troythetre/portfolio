const { db } = require("../../firebase");
const { USER_ROLES } = require("../../voopConstants");
// Create UpdateRole function from userRoutes.js used to update user role
exports.UpdateRole = async function(req, res) {
    // Declare variables for user email and role within the body
    const { userEmail, userRole } = req.body;

    if (req.method === "PUT") {
        try {
            if (!Object.values(USER_ROLES).includes(userRole.toLowerCase())) { //check if the given role is valid
                res.status(400).json({ error: "invalid user role" });
                return;
            }
            // attempt to Find user from database collection
            const userData = await db
                .collection("users")
                .where("email", "==", userEmail.toLowerCase())
                .get();

            if (!userData.empty) { //if found
                await userData.docs[0].ref.update({ role: userRole.toLowerCase() }); //update the role
                return res.status(200).json({
                    message: `Role successfully updated for User ${userEmail}.`,
                });
            } else {
                // User id is not found
                return res
                    .status(404)
                    .json({ error: `User with email ${userEmail} was not found.` });
            }
        } catch (err) {
            //console.error(err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
};