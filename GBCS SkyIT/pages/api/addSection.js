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
                    sectionType,
                    sectionTitle,
                    content
                } = req.body;

                // Retrieve the existing proposal document
                const proposalRef = db.collection("proposals").doc(proposalID);
                const proposalSnapshot = await proposalRef.get();

                // Check if the proposal document exists
                if (!proposalSnapshot.exists) {
                    res.status(404).json({ message: "Proposal not found!" });
                    return;
                }
                
                const existingProposal = proposalSnapshot.data();

                // Check if the proposal is deleted
                if (existingProposal.isDeleted && existingProposal.isDeleted.status) {
                    res.status(400).json({ message: "Proposal is in the trash. Cannot modify a deleted proposal." });
                    return;
                }

                // Calculate the new sectionID based on the number of existing sections
                const sectionID = `Section${existingProposal.sections.length + 1}`;

                // Create a new section object
                const newSection = {
                    sectionID,
                    sectionType,
                    sectionTitle,
                    content,
                    questions: [],
                    isDeleted: {
                        deletionDate: "",
                        deletedBy: "",
                        status: false
                    }
                };

                // Add the new section to the existing sections array
                existingProposal.sections.push(newSection);

                // Update the proposal document with the modified sections array
                await proposalRef.update({ sections: existingProposal.sections });
                res
                    .status(200)
                    .json({ message: "Section added successfully!", sectionID });
            } else {
                res.status(401).json({ error: "Invalid authentication token" });
            }
        } catch (error) {
            console.error("Error adding section:", error);
            res.status(500).json({ error: "Error adding section" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
