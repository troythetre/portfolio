const { db } = require("../../firebase");
const { PROPOSAL_STATUS, OPERATION_TYPE } = require("../../voopConstants");

exports.updateProposalStatus = async function(req, res,next) {
    if (req.method === "PUT") {
        try {
            const { proposalID, status, note } = req.body;
            const proposalDoc = await db
                .collection("proposals")
                .doc(proposalID)
                .get();

            if (!proposalDoc.exists) {
                res.status(404).json({ error: "Proposal not found" });
                return;
            }
            const proposalData = proposalDoc.data();
            // Check if the proposal is deleted
            if (proposalData.isDeleted.status) {
                res
                    .status(400)
                    .json({ error: "Cannot update status of deleted proposal" });
                return;
            }

            if (!Object.values(PROPOSAL_STATUS).includes(status.toLowerCase())) {
                res.status(400).json({ error: "invalid status" });
                return;
            }

            // Update the proposal's status and status notes
            proposalData.statusChangeNotes.push({
                date: new Date(),
                note: note || "",
                status: status.toLowerCase(),
                updatedBy: req.user.email,
            });
            await proposalDoc.ref.update({
                statusChangeNotes: proposalData.statusChangeNotes,
                status: status.toLowerCase(),
            });

            res
                .status(200)
                .json({ message: "Proposal status updated successfully" });
             req.log = {
                proposalID:proposalID,
                actionType: OPERATION_TYPE.EDIT,
                details: `${proposalID} Status Updated`,
            }
            next()

        } catch (error) {
            //console.error("Error updating proposal status:", error);
            res.status(500).json({ error: "Error updating proposal status" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}