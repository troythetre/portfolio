const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");


async function deleteQuestionFromProposal(data, userEmail, reason = null) {
    try {
        const { proposalID, questionID } = data;

        const proposalRef = db.collection('proposals').doc(proposalID);
        const proposalSnapshot = await proposalRef.get();
        const existingProposal = proposalSnapshot.data();

        // Define questionToDelete based on the questionID
        const questionIndex = existingProposal.questions.findIndex(q => q.questionID === questionID);
        const questionToDelete = existingProposal.questions[questionIndex];

        // Mark the question as deleted
        questionToDelete.isDeleted = {
            deletionDate: new Date().toISOString(),
            deletedBy: userEmail,
            status: true
        };

        const trashReason = reason || "No reason left";
        const trashRef = db.collection('trash').doc();
        await trashRef.set({
            itemType: 'question',
            deletedBy: userEmail,
            deletedAt: new Date().toISOString(),
            reasonForDeletion: trashReason,
            restorationInfo: {
                proposalID,
                questionID
            }
        });

        await proposalRef.update({ questions: existingProposal.questions });

        return trashRef.id;
    } catch (error) {
        throw error;
    }
}

exports.deleteQuestion = async function(req, res, next) {
    if (req.method === "DELETE") {
        try {

            const userEmail = req.user.email;
            const { proposalID, questionID, reason } = req.body;

            const proposalRef = db.collection('proposals').doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            if (!proposalSnapshot.exists) {
                res.status(404).json({ error: "Proposal doesn't exist in collection." });
                return;
            }

            const existingProposal = proposalSnapshot.data();

            if (existingProposal.isDeleted && existingProposal.isDeleted.status) {
                res.status(400).json({ error: "Proposal moved to trash already." });
                return;
            }

            const questionIndex = existingProposal.questions.findIndex(q => q.questionID === questionID);

            if (questionIndex === -1) {
                res.status(404).json({ error: "Question not found in proposal" });
                return;
            }

            const questionToDelete = existingProposal.questions[questionIndex];

            if (questionToDelete.isDeleted && questionToDelete.isDeleted.status) {
                res.status(400).json({ error: "Question moved to trash already." });
                return;
            }

            const trashItemId = await deleteQuestionFromProposal({ proposalID, questionID }, userEmail, reason);

            res.status(200).json({ message: "Question moved to trash successfully!", trashItemId });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.ARCHIVE,
                details: `${questionID} has been archived`,
            }
            next()
        } catch (error) {
            // console.error('Error:', error);
            res.status(500).json({ error: "Error deleting question from proposal" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}