const { db } = require("../../firebase");
const { isValidDate } = require("../../helperFunctions");
const { QUESTION_STATUS, OPERATION_TYPE } = require("../../voopConstants");
const { createOrUpdateQuestion } = require("./utils");

exports.addQuestion = async function(req, res, next) {
    if (req.method === "POST") {
        try {

            const {
                proposalID,
                question,
                answer,
                write_deadline,
                review_deadline,
                templateRefID,

            } = req.body;

            const userEmail = req.user.email;

            // Retrieve the existing proposal document
            const proposalSnapshot = await db
                .collection("proposals")
                .doc(proposalID)
                .get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: "Proposal not found!" });
                return;
            }

            const existingProposal = proposalSnapshot.data();
            // Check if the proposal document was tagged as deleted
            if (existingProposal.isDeleted.status == true) {
                res.status(400).json({ message: "Proposal has been deleted!" });
                return;
            }

            if (!isValidDate(write_deadline) ||
                !isValidDate(review_deadline)
            ) {
                res.status(400).json({
                    error: "Invalid date for deadlines. Please provide valid date strings",
                });
                return;
            }
            writeDeadline = isValidDate(write_deadline) //get the default data format
            reviewDeadline = isValidDate(review_deadline) //get the default data format

            // Calculate the new questionID based on the number of existing questions
            const questionID = `Question${existingProposal.questions.length + 1}`;

            // Create a new question object
            const newQuestion = {
                questionID: questionID,
                question: question || "",
                answer: answer || "",
                status: QUESTION_STATUS.INPROGRESS,
                write_deadline: writeDeadline,
                review_deadline: reviewDeadline,
                writers: [],
                reviewers: [],
                comments: [],
                isDeleted: {
                    deletionDate: "",
                    deletedBy: "",
                    status: false
                },
                templateRefID: templateRefID,

            };

            // Add the new question to the existing questions array
            existingProposal.questions.push(newQuestion);

            // Add version history 
            const updated = {
                userEmail,
                operationType: OPERATION_TYPE.ADD,
                question: {
                    questionID,
                    question,
                    answer
                }
            }
            await createOrUpdateQuestion(proposalSnapshot.ref, existingProposal, updated);

            res
                .status(200)
                .json({ message: "Question added successfully!", questionID });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.EDIT ,
                details: `${questionID} was added to Proposal`,
            }
            next()

        } catch (error) {
            //console.error("Error adding question:", error);
            res.status(500).json({ error: "Error adding question: " + error.message  });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}