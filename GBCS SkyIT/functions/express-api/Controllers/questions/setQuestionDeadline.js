const { db } = require("../../firebase");
const { isValidDate } = require("../../helperFunctions")
const { OPERATION_TYPE } = require("../../voopConstants");



exports.setQuestionDeadline = async function(req, res,next) {
    if (req.method === 'PUT') {
        try {

            const { proposalID, questionID, write_deadline, review_deadline } = req.body;
            // Retrieve the existing proposal document
            const proposalRef = db.collection('proposals').doc(proposalID);
            const proposalSnapshot = await proposalRef.get();
            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: 'Proposal not found!' });
                return;
            }

            // Check if the proposal is deleted
            const proposalData = proposalSnapshot.data();
            if (proposalData.isDeleted.status) {
                res.status(400).json({ error: 'Proposal is marked as deleted' });
                return;
            }

            // Find the question index
            const questionIndex = proposalData.questions.findIndex(q => q.questionID === questionID);
            if (questionIndex === -1) {
                res.status(404).json({ message: 'Question not found in proposal!' });
                return;
            }

            // Check if the question is deleted
            if (proposalData.questions[questionIndex].isDeleted.status) {
                res.status(400).json({ error: 'Question is marked as deleted' });
                return;
            }

            // Check if write_deadline is a valid date
            if (write_deadline && !isValidDate(write_deadline)) {
                res.status(400).json({ error: 'Invalid write_deadline date' });
                return;
            }
            // Check if review_deadline is a valid date
            if (review_deadline && !isValidDate(review_deadline)) {
                res.status(400).json({ error: 'Invalid review_deadline date' });
                return;
            }

            const updatedQuestion = {
                ...proposalData.questions[questionIndex],
                write_deadline: isValidDate(write_deadline) || proposalData.questions[questionIndex].write_deadline,
                review_deadline: isValidDate(review_deadline) || proposalData.questions[questionIndex].review_deadline,
            };
            proposalData.questions[questionIndex] = updatedQuestion;
            await proposalRef.set(proposalData);
            // Prepare success message based on updated deadlines
            let successMessage = '';
            if (write_deadline && review_deadline) {
                successMessage = 'Both write and review deadlines updated successfully';
            } else if (write_deadline) {
                successMessage = 'Write deadline updated successfully';
            } else if (review_deadline) {
                successMessage = 'Review deadline updated successfully';
            } else {
                successMessage = 'No deadlines provided, previous values preserved';
            }
            res.status(200).json({ success: successMessage });
             req.log = {
                proposalID: proposalID,
                actionType:OPERATION_TYPE.EDIT,
                details: ` deadlines of  ${questionID} updated `,
            }
            next()
        } catch (error) {
            //console.error('Error setting question deadline:', error);
            res.status(500).json({ error: 'Error setting question deadline' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}