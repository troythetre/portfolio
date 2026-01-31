const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
exports.removeTeamMember = async function(req, res, next) {
    // put request to update proposal
    if (req.method === "PUT") {
        try {

            const { proposalID, userEmail } = req.body;

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
                res.status(400).json({ message: "Proposal has been deleted" });
                return;
            }

            //get registered user emails
            const registeredUsers = await db.collection('users').get();
            const registeredUserEmails = [];

            registeredUsers.forEach((doc) => {
                const user = doc.data().email;
                registeredUserEmails.push(user);
            })

            //check if user is registered in database
            const emailAddress = userEmail;
            if (!registeredUserEmails.includes(emailAddress)) {
                res.status(400).json({ error: "User not registered in database" })
                return;
            }

            //find index for team member
            const index = existingProposal.teamMembers.findIndex(object => {
                return object.userEmail === userEmail;
            });


            //check to make sure user was a team member and if so delete team member
            if (index === -1) {
                res.status(400).json({ error: "User isn't a team member of current proposal " });
                return;
            } else {
                existingProposal.teamMembers.splice(index, 1);
            }

            //update proposal with new team members 
            await proposalSnapshot.ref.update({ teamMembers: existingProposal.teamMembers });

            //return success message 
            res.status(200).json({ message: "Team member successfully deleted" });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.ASSIGN,
                details: `${userEmail } has been removed as team member of ${proposalID}`,
            }
            next()

        } catch (error) {
            // console.error("Error deleting team member:", error);
            res.status(500).json({ error: "Error deleting team members" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}