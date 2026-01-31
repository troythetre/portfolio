const { db } = require("../../firebase");
const { validateTeamMembers } = require("../../helperFunctions");
const { OPERATION_TYPE } = require("../../voopConstants");

exports.addTeamMembers = async function handler(req, res, next) {
  if (req.method === "PUT") {
    try {
      // Fetch Body Information
      const { proposalID, teamMembers } = req.body;

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
        res.status(400).json({ message: "Proposal has been deleted" });
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
        req.log = {
          proposalID: proposalID,
          actionType: OPERATION_TYPE.ASSIGN,
          details: `new team members assigned on ${proposalID}`,
        };
        next();
      } else {
        res.status(400).json({
          error: `No New Team member(s) added! The input list had ${
            registeredUserEmails.length - trackNewMembers
          } existing team members and  ${
            teamMembers.length - registeredUserEmails.length
          } unregisted users`,
        });
      }
    } catch (error) {
      // console.error("Error adding  team member:", error);
      res.status(500).json({ error: "Error adding new team members" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
