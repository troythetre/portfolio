import { db, decodeToken } from "./firebase";

async function restoreSectionFromTrash(trashID) {
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

export default async function handler(req, res) {
    if (req.method === "PUT") {
        try {
            const bearerToken = req.headers.authorization?.split(" ")[1];

            if (!bearerToken) {
                res.status(401).json({ error: "Missing authentication token" });
                return;
            }

            

            const decodedToken = await decodeToken(bearerToken);

            if (!decodedToken || !decodedToken.email) {
                res.status(401).json({ error: "Invalid authentication token" });
                return;
            }

            const userEmail = decodedToken.email;

            // Get the trashID from the request body
            const { trashID } = req.body;

            // Check if the user is authorized to restore a section
            if (userEmail !== decodedToken.email) {
                res.status(403).json({ error: "Unauthorized: You are not allowed to restore this section" });
                return;
            }

            const restoreResult = await restoreSectionFromTrash(trashID);
            res.status(200).json({ message: restoreResult });
        } catch (error) {
            console.error("Error handling section restore request:", error);
            res.status(500).json({ error: "Error processing section restore request" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}


