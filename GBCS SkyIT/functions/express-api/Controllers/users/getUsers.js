const { db } = require("../../firebase");

exports.getUsers = async function(req, res) {
    if (req.method === "GET") {
        try {

            // Retrieve users' email and role info from the database
            const usersSnapshot = await db.collection('users').get();
            const Users = [];

            // Set to store unique users
            const uniqueUsers = new Set();

            // Add the user to the Set to track uniqueness
            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                const user = userData.email;
                const role = userData.role; // Assuming the role field is present in the user's data

                if (user && !uniqueUsers.has(user)) {
                    Users.push({ email: user, role: role });
                    uniqueUsers.add(user);
                }
            });

            res.status(200).json({ Users });
        } catch (error) {
            //console.error("Error retrieving users:", error);
            res.status(500).json({ error: "Error retrieving users" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}