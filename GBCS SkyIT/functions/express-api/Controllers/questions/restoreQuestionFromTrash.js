const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
exports.restoreQuestion = async function(req, res, next) {
    if (req.method === "PUT") {
        try {
            //  document ID in the request body
            const { trashID } = req.body;

            const trashRef = db.collection("trash").doc(trashID);
            const trashSnapshot = await trashRef.get();

            if (!trashSnapshot.exists) {
                res.status(404).json({ message: "Trash document not found!" });
                return;
            }

            if (trashSnapshot.data().itemType !== "question") {
                res.status(400).json({ message: "itemType is not question in trashID" });
                return;
            }

            // Get the proposal data
            const restorationInfo = trashSnapshot.data().restorationInfo;

            const proposalID = restorationInfo.proposalID;
            const questionID = restorationInfo.questionID;

            // // Update the proposal in the proposals collection
            const proposalRef = db.collection("proposals").doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: "Proposal not found!" });
                return;
            }

            // Retrieve the question data from the proposal document
            const proposalData = proposalSnapshot.data();

            // Get the proposal isDeleted status
            const proposalStatus = proposalData.isDeleted ?.status || false;
            if (proposalStatus == true) {
                res.status(400).json({ message: "Proposal has been deleted!" });
                return;
            }

            // Get question data
            const questions = proposalData.questions || [];

            // Find the question that matches the questionID
            const question = questions.find((q) => q.questionID === questionID);

            if (!question) {
                res.status(404).json({ message: "Question not found in proposal!" });
                return;
            }

            // Restore question by updating fields
            question.isDeleted = {
                status: false,
                deletionDate: null,
                deletedBy: null,
            };

            // Update the question within the questions array
            const updatedQuestions = questions.map((q) =>
                q.questionID === questionID ? question : q
            );
            await proposalRef.update({ questions: updatedQuestions });

            // Delete the trash document
            await trashRef.delete();

            res.status(200).json({ message: "Question restored successfully!" });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.RESTORE,
                details: `  ${questionID}  has been restored `,
            }
            next()
        } catch (error) {
            // console.error("Error handling restore request:", error);
            res.status(500).json({ error: "Error handling restore request" });

        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}