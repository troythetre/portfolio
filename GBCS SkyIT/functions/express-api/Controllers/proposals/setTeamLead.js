const { db } = require("../../firebase");
const { OPERATION_TYPE, USER_ROLES } = require("../../voopConstants");
const { markAuthCodeAsUnavailable } = require('../users/useAuthCode');
exports.setTeamLead = async function(req, res, next) {
    // Put request to assign team lead
    if (req.method === "PUT") {
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
                res.status(400).json({ message: "Proposal has been deleted." });
                return;
            }
            
            // Fetch team members in team array
            const TeamMembers = await existingProposal.teamMembers;
            
            // Check if the user is already a team lead or if user is a team member
            const teamMemberIndex = TeamMembers.findIndex(member => {
                return member.userEmail === userEmail;
            });
            
            // Check if user is a team member
            if (teamMemberIndex === -1) {
                res.status(400).json({ error: "User is not a team member of the current proposal." });
                return;
            }
            
            // Check if the user is already a team lead
            if (TeamMembers[teamMemberIndex].isLead) {
                res.status(400).json({ error: "User email address is already a team lead." });
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

            // Assign the role of 'team lead' to the team member by setting 'isLead' to true
            TeamMembers[teamMemberIndex].isLead = true;
            
            // Update proposal with the modified team member
            await proposalSnapshot.ref.update({ teamMembers: TeamMembers });
            
            // Return success message
            res.status(200).json({ message: "Team lead assigned successfully" });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.ASSIGN,
                details: `${userEmail } has been assigned as new team lead assigned on ${proposalID}`,
            }
            next()
            
            
        } catch (error) {
            //console.error("Error assigning team lead:", error);
            res.status(500).json({ error: "Error assigning team lead" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}