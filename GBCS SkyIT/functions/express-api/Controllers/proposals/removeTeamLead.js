const { db } = require("../../firebase");
const { OPERATION_TYPE, USER_ROLES } = require("../../voopConstants");
const { markAuthCodeAsUnavailable } = require('../users/useAuthCode');
exports.removeTeamLead = async function(req, res, next) {
    // Put request to assign team lead
    if (req.method === "DELETE") {
        try {
            const { proposalID, userEmail, authCode } = req.body;
            
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
            
            // Fetch team members in team array
            const TeamMembers = await existingProposal.teamMembers;
            
            // Check if the user is already a team lead or if user is a team member
            let countTeamLead = 0;
            let teamMemberIndex = -1;
            TeamMembers.forEach((member, index) => {
                // Count team leads for the proposal
                if(member.isLead){ countTeamLead++; }
                // Find the matching of the user.
                if(member.userEmail === userEmail && teamMemberIndex === -1){ teamMemberIndex = index;}
            });
            
            // Check if user is a team member
            if (teamMemberIndex === -1) {
                res.status(400).json({ error: "User is not a team member of the current proposal" });
                return;
            }
            
            // Check if the user is not a team lead
            if (!TeamMembers[teamMemberIndex].isLead) {
                res.status(400).json({ error: "User is not a team lead" });
                return;
            }
            
            // Ensure the proposal has at least one team leader
            if(countTeamLead - 1 <= 0){
                res.status(403).json({ error: "At least one team lead needs to be assigned."});
                return;
            }
            
            // Check if user is admin or with valid auth
            if (req.user.role !== USER_ROLES.ADMIN) {
                // Check if authCode is provided if user is not an admin
                if (authCode === undefined){
                    res.status(401).json({ error: 'Unauthorized: User is not an admin or having a valid auth code.' });
                    return;
                }

                const result = await markAuthCodeAsUnavailable(req, authCode);
                if (result.success == false) {
                    res.status(result.statusCode).json({ message: result.message });
                    return;
            } 
        }
            // Remove the role of 'team lead' to the team member by setting 'isLead' to false
            TeamMembers[teamMemberIndex].isLead = false;
            
            // Update proposal with the modified team member
            await proposalSnapshot.ref.update({ teamMembers: TeamMembers });

            // Return success message
            res.status(200).json({ message: "Team lead removed successfully" });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.DELETE,
                details: `${userEmail } has been removed as team lead assigned on proposal ${proposalID}`,
            }
            next()


        } catch (error) {
            //console.error("Error assigning team lead:", error);
            res.status(500).json({ error: "Error removing team lead" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}