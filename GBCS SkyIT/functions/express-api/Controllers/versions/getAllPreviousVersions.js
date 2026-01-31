const { db } = require("../../firebase");

exports.getAllPreviousVersions = async function handler(req, res) {
	if (req.method === "GET") {
		try {

			const { proposalID } = req.params;

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
					res.status(400).json({ message: 'Proposal is deleted!' });
					return;
			}

				// get all versions
			const versions = existingProposal.versionHistory;

			res.status(200).json({ versions });
	} catch (error) {
			res.status(500).json({ error: "Error getting proposal" });
	}
	} else {
			res.status(405).json({ error: "Method not allowed" });
	}
}