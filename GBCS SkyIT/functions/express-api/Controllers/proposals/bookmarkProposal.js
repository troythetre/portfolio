const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
exports.bookmarkProposal = async function(req, res, next) {
    if (req.method === "PUT") {
        try {

            const { proposalID } = req.body;

            // Retrieve the existing proposal document
            const proposalRef = db.collection("proposals").doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: "Proposal not found!" });
                return;
            }

            const existingProposal = proposalSnapshot.data();

            // Check if the proposal is tagged as deleted
            if (existingProposal.isDeleted.status) {
                res.status(400).json({ message: "Cannot mark/unmark a deleted proposal as bookmarked" });
                return;
            }

            // Check if the user's email is already in the bookmarkedBy array
            const isBookmarked = existingProposal.bookmarkedBy.includes(req.user.email);

            // Update the bookmarked status
            let updatedBookmarkedBy;
            if (isBookmarked) {
                updatedBookmarkedBy = existingProposal.bookmarkedBy.filter(email => email !== req.user.email);
            } else {
                updatedBookmarkedBy = [...existingProposal.bookmarkedBy, req.user.email];
            }

            // Update the proposal document with the modified bookmarked status
            await proposalRef.update({ bookmarkedBy: updatedBookmarkedBy });

            res.status(200).json({ message: "Bookmark status updated successfully!" });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.EDIT,
                details: `${proposalID} has been bookmarked by ${req.user.email}`,
            }
            next()
        } catch (error) {
            //console.error("Error updating bookmark status:", error);
            res.status(500).json({ error: "Error updating bookmark status" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}