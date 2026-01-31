import { db, decodeToken } from "./firebase";
import { USER_ROLES } from "./voopConstants";


export default async function handler(req, res) {
    // Put request to assign team lead
    if (req.method === "PUT") {
        try {
            const bearerToken = req.headers.authorization?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }

            // Decode the Firebase ID token
            const decodedToken = await decodeToken(bearerToken);

            if (!decodedToken || !decodedToken.email) {
                res.status(401).json({ error: "Invalid authentication token" });
                return;
            }

            const { proposalID, userEmail } = req.body;

            // Attempt to find the user in the database
            const findUser = await db
                .collection("users")
                .where("email", "==", decodedToken.email)
                .get();

            if (!findUser.empty) {
                // Assuming email is unique, get the user data
                const userRecord = findUser.docs[0].data();

                // Check if the user is an admin
                if (
                    userRecord.hasOwnProperty("role") &&
                    userRecord.role === USER_ROLES.ADMIN
                ) {
                    // Retrieve the existing proposal document
                    const proposalSnapshot = await db
                        .collection("proposals")
                        .doc(proposalID)
                        .get();

                    // Check if the proposal document exists
                    if (!proposalSnapshot.exists) {
                        res.status(404).json({ message: "Proposal not found!" });
                        return;
                    }

                    const existingProposal = proposalSnapshot.data();

                    // Check if the proposal document has been deleted
                    if (existingProposal.isDeleted.status) {
                        res.status(500).json({ message: "Proposal has been deleted" });
                        return;
                    }

                    // Fetch team members in team array
                    const TeamMembers = await existingProposal.teamMembers;

                    // Check if the user is already a team lead
                    const teamMemberIndex = TeamMembers.findIndex(member => {
                        return member.userEmail === userEmail;
                    });

                    if (teamMemberIndex === -1) {
                        res.status(400).json({ error: "User is not a team member of the current proposal" });
                        return;
                    }

                    // Check if the user is already a team lead
                    if (TeamMembers[teamMemberIndex].isLead) {
                        res.status(400).json({ error: "User email address is already a team lead" });
                        return;
                    }

                    // Assign the role of 'team lead' to the team member by setting 'isLead' to true
                    TeamMembers[teamMemberIndex].isLead = true;

                    // Update proposal with the modified team member
                    await proposalSnapshot.ref.update({ teamMembers: TeamMembers });

                    // Return success message
                    res.status(200).json({ message: "Team lead assigned successfully" });
                    return;
                } else {
                    res.status(400).json({ error: "Only Admins can assign team leads" });
                    return;
                }
            } else {
                res.status(404).json({ error: "User not found" });
                return;
            }
        } catch (error) {
            console.error("Error assigning team lead:", error);
            res.status(500).json({ error: "Error assigning team lead" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
