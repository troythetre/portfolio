const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
const { createOrUpdateSection } = require("./utils");

exports.addSection = async function(req, res, next) {
    if (req.method === "PUT") {
        try {

            const {
                proposalID,
                sectionType,
                sectionTitle,
                content
            } = req.body;

            const userEmail = req.user.email;

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

            const updated = {
                userEmail,
                operationType: OPERATION_TYPE.ADD,
                section: {
                    sectionID,
                    sectionTitle,
                    content
                }
            }
            await createOrUpdateSection(proposalRef, existingProposal, updated);
            
            // Update the proposal document with the modified sections array
            await proposalRef.update({ sections: existingProposal.sections });
            res
                .status(200)
                .json({ message: "Section added successfully!", sectionID });
            req.log = {
                proposalID: proposalID,
                actionType: OPERATION_TYPE.ADD,
                details: `${sectionID} was added to Proposal`,
            }
            next()

        } catch (error) {
            res.status(500).json({ error: "Error adding section" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}