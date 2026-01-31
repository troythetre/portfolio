const { db } = require("../../firebase");

exports.getSectionContent = async function (req, res) {
    if (req.method === "GET") {
        try {
            const { proposalID, sectionID } = req.params;

            // Retrieve the existing proposal document
            const proposalRef = db.collection("proposals").doc(proposalID);
            const proposalSnapshot = await proposalRef.get();

            // Check if the proposal document exists
            if (!proposalSnapshot.exists) {
                res.status(404).json({ message: "Proposal not found!" });
                return;
            }

            const proposal = proposalSnapshot.data();

            // Check if the proposal is deleted
            if (proposal.isDeleted.status && proposal.isDeleted) {
                res.status(400).json({ message: "Proposal is deleted." });
                return;
            }

            // Find the requested section by its ID
            const section = proposal.sections.find(s => s.sectionID === sectionID);

            //check if section deleted
            if (section.isDeleted && section.isDeleted.status) {
                res.status(404).json({ message: "Section has been deleted!" });
                return;
            }

            // Check if the section exists
            if (!section) {
                res.status(404).json({ message: "Section not found!" });
                return;
            }

            // Return the found section
            res.status(200).json(section);
        } catch (error) {
            res.status(500).json({ error: "Error retrieving section" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }

};