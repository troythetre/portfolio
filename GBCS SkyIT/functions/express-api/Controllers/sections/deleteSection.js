const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
async function moveSectionToTrash(data, userEmail, reason = null) {
    try {
        const { proposalID, sectionID, proposalRef, existingProposal } = data;


        // Find the section to move to trash
        const sectionIndex = existingProposal.sections.findIndex(
            (section) => section.sectionID === sectionID
        );

        if (sectionIndex === -1) {
            throw new Error("Section not found in proposal");
        }

        const sectionToDelete = existingProposal.sections[sectionIndex];

        // Check if the section is already marked as deleted
        if (sectionToDelete.isDeleted && sectionToDelete.isDeleted.status) {
            throw new Error("Section is already in the trash.");
        }

        // Create a trash reference for the deleted section
        const sectionTrashRef = db.collection("trash").doc();
        await sectionTrashRef.set({
            itemType: "section",
            deletedBy: userEmail,
            deletedAt: new Date().toISOString(),
            reasonForDeletion: reason || "No reason left",
            restorationInfo: {
                proposalID,
                sectionID,
            },
        });

        // Mark the section as deleted
        sectionToDelete.isDeleted = {
            deletionDate: new Date().toISOString(),
            deletedBy: userEmail,
            status: true,

        };

        // Create an array to store trash references for questions
        const questionTrashRefs = [];

        // Iterate through questions associated with the section
        for (const questionID of sectionToDelete.questions) {
            // Create a trash reference for the deleted question
            const questionTrashRef = db.collection("trash").doc();
            await questionTrashRef.set({
                itemType: "question",
                deletedBy: userEmail,
                deletedAt: new Date().toISOString(),
                reasonForDeletion: reason || "No reason left",
                restorationInfo: {
                    proposalID,
                    sectionID,
                    questionID,
                },
            });

            // Mark the question as deleted in the proposal
            const questionIndex = existingProposal.questions.findIndex(
                (question) => question.questionID === questionID
            );
            if (questionIndex !== -1) {
                existingProposal.questions[questionIndex].isDeleted = {
                    deletionDate: new Date().toISOString(),
                    deletedBy: userEmail,
                    status: true,

                };
            }

            // Add the trash reference ID to the array
            questionTrashRefs.push(questionTrashRef.id);
        }

        // Empty the questions array for the section
        sectionToDelete.questions = [];

        // Update the proposal with the section marked as deleted and the questions in the section array removed
        await proposalRef.update({
            sections: existingProposal.sections,
            questions: existingProposal.questions, // Update the proposal with questions marked as deleted
        });

        return {
            sectionTrashId: sectionTrashRef.id,
            questionTrashIds: questionTrashRefs,
        };
    } catch (error) {
        throw error;
    }
}

exports.deleteSection = async function(req, res, next) {
    if (req.method === "DELETE") {
        try {

            const userEmail = req.user.email;
            const { proposalID, sectionID, reason } = req.body;

            const proposalRef = db.collection("proposals").doc(proposalID);
            const proposalSnapshot = await proposalRef.get();
            const existingProposal = proposalSnapshot.exists ?
                proposalSnapshot.data() :
                null;

            if (!existingProposal) {
                res
                    .status(404)
                    .json({ error: "Proposal doesn't exist in collection." });
                return;
            }

            if (existingProposal.isDeleted && existingProposal.isDeleted.status) {
                res
                    .status(400)
                    .json({ error: "Proposal is already in the trash." });
                return;
            }

            const trashRefs = await moveSectionToTrash({
                    proposalID,
                    sectionID,
                    proposalRef,
                    existingProposal,
                },
                userEmail,
                reason
            );
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.ARCHIVE,
                details: `${sectionID}  has been archived`,
            }
            res.status(200).json({
                message: "Section and associated questions moved to trash successfully!",
                sectionTrashId: trashRefs.sectionTrashId,
                questionTrashIds: trashRefs.questionTrashIds,
            });

            next()
        } catch (error) {

            if (error.message === "Section is already in the trash.") {
                res.status(400).json({ error: "Section is already in the trash." });
            } else {
                res.status(500).json({ error: "Error moving section to trash" });
            }
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}