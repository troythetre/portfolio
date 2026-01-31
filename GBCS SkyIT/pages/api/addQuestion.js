import { db, verifyToken } from "./firebase";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const bearerToken = req.headers.authorization ?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }

            // Verify the Firebase ID token
            const isTokenValid = await verifyToken(bearerToken);

            if (isTokenValid) {
                const {
                    proposalID,
                    question,
                    answer,
                    write_deadline,
                    review_deadline, 
                    templateRefID,
                  
                } = req.body;

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
                if (existingProposal.isDeleted.status==true) {
                    res.status(404).json({ message: "Proposal has been deleted!" });
                    return;
                }
                const allowedStatuses = [
                    "in progress",
                    "request for review",
                    "under review",
                    "changes requested",
                    "approved",
                ];

                // Validate write_deadline and review_deadline
                const writeDeadlineDate = write_deadline;
                const reviewDeadlineDate = review_deadline;

                if (!isValidDate(writeDeadlineDate) ||
                    !isValidDate(reviewDeadlineDate)
                ) {
                    res.status(400).json({
                        error: "Invalid date format for deadlines. Please provide valid date strings... Use the YYYY-MM-DD format",
                    });
                    return;
                }


                // Calculate the new questionID based on the number of existing questions
                const questionID = `Question${existingProposal.questions.length + 1}`;

                // Create a new question object
                const newQuestion = {
                    questionID: questionID,
                    question: question||"",
                    answer: answer || "",
                    status: "in progress",
                    write_deadline: writeDeadlineDate,
                    review_deadline: reviewDeadlineDate,
                    writers: [],
                    reviewers: [],
                    comments:  [],
                    isDeleted: {
                        deletionDate: "",
                        deletedBy: "",
                        status: false
                    },
                    templateRefID:templateRefID,
                    
                };

                // Add the new question to the existing questions array
                existingProposal.questions.push(newQuestion);

                // Update the proposal document with the modified questions array
                await proposalSnapshot.ref.update({ questions: existingProposal.questions });
                res
                    .status(200)
                    .json({ message: "Question added successfully!", questionID });
            } else {
                res.status(401).json({ error: "Invalid authentication token" });
            }
        } catch (error) {
            console.error("Error adding question:", error);
            res.status(500).json({ error: "Error adding question" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}

function isValidDate(dateString) {
    // Regular expression to match the date format (YYYY-MM-DD)
    const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/;
    return dateRegex.test(dateString);
}

