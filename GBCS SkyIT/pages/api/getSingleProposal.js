import { db, verifyToken } from "./firebase";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            const bearerToken = req.headers.authorization ?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }
            // Verify the Firebase ID token
            const isTokenValid = await verifyToken(bearerToken);

            if (!isTokenValid) {
                res.status(401).json({ error: "Invalid authentication token" });
                return;
            }
            const { proposalID } = req.body;

            // Retrieve the existing proposal document
            const proposalRef = db.collection('proposals').doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: 'Proposal not found!' });
                return;
            }

            const existingProposal = proposalSnapshot.data();

            // Check if the proposal is marked as deleted
            if (existingProposal.isDeleted.status) {
                res.status(404).json({ message: 'Proposal is deleted!' });
                return;
            }

            // Filter out deleted questions associated with the proposal
            const nonDeletedQuestions = existingProposal.questions.filter(question => !question.isDeleted.status);
            existingProposal.questions = nonDeletedQuestions;

            // Filter out deleted sections associated with the proposal
            const nonDeletedSections = existingProposal.sections.filter(section => !section.isDeleted.status);
            existingProposal.sections = nonDeletedSections;

            res.status(200).json({ proposal: existingProposal });
        } catch (error) {
            console.error("Error getting proposal:", error);
            res.status(500).json({ error: "Error getting proposal" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
