import { db, decodeToken } from "./firebase";
import { validateTeamMembers } from "./helperFunctions";
import { USER_ROLES } from "./voopConstants";
export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const bearerToken = req.headers.authorization?.split(" ")[1];
      if (!bearerToken) {
        res.status(401).json({ error: "Missing authentication token" });
        return;
      }
      // Verify the Firebase ID token and get the decoded token info
      const decodedToken = await decodeToken(bearerToken);

      if (!decodedToken || !decodedToken.email) {
        res.status(401).json({ error: "Invalid authentication token" });
        return;
      }
      // Fetch Body Information
      const { proposalID, teamMembers } = req.body;
      // Fetch the user document based on the email from the decoded token
      const userQuerySnapshot = await db
        .collection("users")
        .where("email", "==", decodedToken.email)
        .get();
      // Check if a user document was found
      if (!userQuerySnapshot.empty) {
        // Assuming email is unique, get the user data from the first document
        const userData = userQuerySnapshot.docs[0].data();
        // Check if the user has an admin role
        if (
          userData.hasOwnProperty("role") &&
          userData.role === USER_ROLES.ADMIN
        ) {
          // Retrieve the proposal document based on the provided proposalID
          const proposalDocSnapshot = await db
            .collection("proposals")
            .doc(proposalID)
            .get();
          // Check if the proposal document exists
          if (!proposalDocSnapshot.exists) {
            res.status(404).json({ message: "Proposal not found!" });
            return;
          }
          // Extract proposal data from the document snapshot
          const proposalData = proposalDocSnapshot.data();
          // Check if the proposal has been marked as deleted
          if (proposalData.isDeleted.status) {
            res.status(500).json({ message: "Proposal has been deleted" });
            return;
          }
          // Check if team members are registered users
          const registeredUserEmails = await validateTeamMembers(teamMembers);

          if (registeredUserEmails.length == 0) {
            res.status(400).json({
              error:
                "The provided list of users are not registered on the database",
            });
            return;
          }

          // get extisting  team members in the proposal to avoid duplicates
          const existingTeamMemberEmails = proposalData.teamMembers.map(
            (member) => member.userEmail
          );
          let trackNewMembers = 0;
          registeredUserEmails.forEach((member) => {
            // add only new team members to the proposal
            if (!existingTeamMemberEmails.includes(member.userEmail)) {
              proposalData.teamMembers.push(member);
              trackNewMembers++;
            }
          });
          if (trackNewMembers > 0) {
            // Update the proposal document
            await proposalDocSnapshot.ref.update({
              teamMembers: proposalData.teamMembers,
            });
            res.status(200).json({
              message: `${trackNewMembers} New Team member(s) added successfully. The input list had ${
                registeredUserEmails.length - trackNewMembers
              } existing team members and  ${
                teamMembers.length - registeredUserEmails.length
              } unregisted users`,
            });
          } else {
            res.status(400).json({
              error: `No New Team member(s) added! The input list had ${
                registeredUserEmails.length - trackNewMembers
              } existing team members and  ${
                teamMembers.length - registeredUserEmails.length
              } unregisted users`,
            });
          }
        } else {
          res
            .status(403)
            .json({ error: "Only admins can perform this action" });
        }
      } else {
        res.status(401).json({ error: "User not authorized" });
      }
    } catch (error) {
      console.error("Error adding  team member:", error);
      res.status(500).json({ error: "Error adding new team members" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
