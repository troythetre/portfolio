const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");

exports.updateQuestionWithResponse = async function(req, res,next) {
    if (req.method === "PUT") {
        try {
          const { proposalID, questionID, responseID } = req.body;
          
      // Retrieve the existing proposal document
        const proposalRef = db.collection("proposals").doc(proposalID);
        const proposalSnapshot = await proposalRef.get();

        if (!proposalSnapshot.exists) {
            res.status(404).json({ message:"Proposal not found!" });
            return;
        }

        const existingProposal = proposalSnapshot.data();

        // Get the proposal isDeleted status
        const proposalStatus = existingProposal?.isDeleted?.status || false;

        if (proposalStatus) {
             res.status(400).json({ message:"Proposal has been deleted!" });
                return;
        }

        // Find the index of the question within the questions array
        const questionIndex = existingProposal.questions.findIndex(
            (q) => q.questionID === questionID
        );

        if (questionIndex === -1) {
            res.status(404).json({ message:"Question not found in proposal!" });
                return;
        }

        // Check if the question is deleted
        const questionStatus =
            existingProposal.questions[questionIndex]?.isDeleted ?.status || false;

        if (questionStatus) {
             res.status(400).json({ message:"Question has been deleted!" });
                return;
        }

        // Fetch the response data based on responseID
        const responseDoc = await db.collection("responses").doc(responseID).get();

        if (!responseDoc.exists) {
            res.status(404).json({ message:"Response not found!" });
            return;
        }

        const responseData = responseDoc.data();

        // Check if the response is deleted
        if (responseData?.isDeleted ?.status) {
            res.status(400).json({ message:"Response has been deleted!" });
                return;
        }

        // Update the question and answer fields using response data if they are defined
        if (responseData.Answer !== undefined) {
            existingProposal.questions[questionIndex].answer = responseData.Answer;
        }

        if (responseData.Question !== undefined) {
            existingProposal.questions[questionIndex].question = responseData.Question;
        }

        // Update the proposal document with the modified questions array
            await proposalRef.update({ questions: existingProposal.questions });
             req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.EDIT ,
                details: ` ${questionID}'s answer was updated with data from responseID: ${responseID}`,
            }
            res.status(200).json({ message: "Question and answer updated successfully!" });
            
            
            next()
        } catch (error) {
            //console.error("Error updating question and answer:", error);
            res.status(500).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}