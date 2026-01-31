const { db } = require("../../firebase");

exports.getAdminUsers = async function(req, res) {
    if (req.method === "GET") {
        try {

            // Retrieve admin users' email and role info from the database
            const usersSnapshot = await db.collection('users').where('role', '==', 'admin').get();
            const adminUsers = [];

            // Set to store unique admin users
            const uniqueAdminUsers = new Set();

            // Add admin users to the Set to track uniqueness
            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                const user = userData.email;
                const role = userData.role; // Assuming the role field is present in the user's data

                if (user && !uniqueAdminUsers.has(user)) {
                    adminUsers.push({ email: user, role: role });
                    uniqueAdminUsers.add(user);
                }
            });

            res.status(200).json({ adminUsers });
        } catch (error) {
            // console.error("Error retrieving admin users:", error);
            res.status(500).json({ error: "Error retrieving admin users" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}