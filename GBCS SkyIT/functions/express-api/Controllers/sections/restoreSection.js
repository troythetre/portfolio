const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
async function restoreSectionFromTrash(trashID, req) {
    try {
        const trashRef = db.collection("trash").doc(trashID);
        const trashSnapshot = await trashRef.get();

        if (!trashSnapshot.exists) {
            return "TrashID not found";
        }

        const trashData = trashSnapshot.data();

        // Check if the trash item has itemType as "section"
        if (trashData.itemType === "section") {
            const restorationInfo = trashData.restorationInfo;
            const proposalID = restorationInfo.proposalID;
            const sectionID = restorationInfo.sectionID;

            // Update proposal in the proposals collection in DB.
            const proposalRef = db.collection("proposals").doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            if (!proposalSnapshot.exists) {
                return "Proposal not found";
            }

            const existingProposal = proposalSnapshot.data();

            // Check if the proposal is already in the trash
            if (existingProposal.isDeleted && existingProposal.isDeleted.status) {
                return "Proposal is in the trash. Cannot restore section.";
            }

            // Find the section to restore
            const sectionIndex = existingProposal.sections.findIndex(section => section.sectionID === sectionID);

            if (sectionIndex === -1) {
                return "Section not found";
            }

            const sectionToRestore = existingProposal.sections[sectionIndex];

            // Restore section by updating its fields
            sectionToRestore.isDeleted = {
                deletionDate: null,
                deletedBy: null,
                status: false
            };

            // Update the proposal's sections array
            existingProposal.sections[sectionIndex] = sectionToRestore;

            // Mark questions in the section deleted status false
            if (sectionToRestore.questions && sectionToRestore.questions.length > 0) {
                sectionToRestore.questions.forEach(question => {
                    question.isDeleted = {
                        deletionDate: null,
                        deletedBy: null,
                        status: false
                    };
                });
            }

            // Delete the trash document from trash collection
            await trashRef.delete();

            // Update the proposal document in the database
            await proposalRef.update({ sections: existingProposal.sections });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.RESTORE,
                details: `${sectionID} was been restored`,
            }

            return "Section restored successfully, and TrashID deleted.";
        } else {
            // Handle other item types (if needed)
            return "Invalid itemType. Use 'section'.";
        }
    } catch (error) {
        console.error("Error restoring section from trash collection:", error);
        throw error;
    }
}

exports.restoreSection = async function(req, res, next) {
    if (req.method === "PUT") {
        try {

            // Get the trashID from the request body
            const { trashID } = req.body;

            const restoreResult = await restoreSectionFromTrash(trashID, req);
            res.status(200).json({ message: restoreResult });

            next()
        } catch (error) {
            //console.error("Error handling section restore request:", error);
            res.status(500).json({ error: "Error processing section restore request" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}