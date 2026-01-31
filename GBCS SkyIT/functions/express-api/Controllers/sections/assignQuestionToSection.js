const { db } = require("../../firebase");
const { OPERATION_TYPE } = require("../../voopConstants");
const { createOrUpdateSection } = require("./utils");

async function checkExistenceAndDeletionStatus(payload, proposalSnapshot) {
	const { proposalID, questionID, sectionID } = payload;

	// Check if the proposal document exists
	if (!proposalSnapshot.exists) {
		throw new Error("Proposal not found!");
	}

	// Get the existing proposal data
	const existingProposal = proposalSnapshot.data();

	// Check if the proposal document was tagged as deleted
	if (existingProposal.isDeleted?.status == true) {
		throw new Error("Proposal has been deleted!");
	}

	// Check questionID exist
	const questionIndex = existingProposal.questions.findIndex(
		(q) => q.questionID === questionID
	);

	if (questionIndex == -1) {
		throw new Error(`Question not found in Proposal ${proposalID}.`);
	}

	// Check if the question was tagged as deleted
	if (existingProposal.questions[questionIndex].isDeleted?.status == true) {
		throw new Error("Question has been deleted!");
	}

	// Check sectionID exist
	const sectionIndex = existingProposal.sections.findIndex(
		(s) => s.sectionID === sectionID
	);

	if (sectionIndex == -1) {
		throw new Error(`Section not found in Proposal ${proposalID}.`);
	}

	// Check if the section was tagged as deleted
	if (existingProposal.sections[sectionIndex].isDeleted?.status == true) {
		throw new Error("Section has been deleted!");
	}
}

async function assignQuestionToSection(payload, req) {
	const { proposalID, questionID, sectionID } = payload;
	const userEmail = req.user.email;

	// Check proposalID exist
	const proposalRef = db.collection("proposals").doc(proposalID);
	const proposalSnapshot = await proposalRef.get();

	// Check if valid and deleted status for proposal Id, question Id, section Id
	await checkExistenceAndDeletionStatus(req.body, proposalSnapshot);

	// Get the existing proposal data
	const existingProposal = proposalSnapshot.data();

	// Check questionID exist
	const questionIndex = existingProposal.questions.findIndex(
		(q) => q.questionID === questionID
	);

	// Check sectionID exist
	const sectionIndex = existingProposal.sections.findIndex(
		(s) => s.sectionID === sectionID
	);

	// Check if sectionID is not empty
	const questionSectionID = existingProposal.questions[questionIndex].sectionID;

	let sIdx = -1;

	if (questionSectionID && questionSectionID !== sectionID) {
		// Find the section with the matching sectionID
		sIdx = existingProposal.sections.findIndex(
		(s) => s.sectionID === questionSectionID
		);

		// Check status of section
		if (sIdx === -1) {
		throw new Error(`Section not found in Proposal ${proposalID}.`);
		}

		const section = existingProposal.sections[sIdx];
		if (section.isDeleted?.status) {
		throw new Error("Section has been deleted!");
		}

		// Remove questionID from section
		existingProposal.sections[sIdx].questions = section.questions.filter(
		(qID) => qID !== questionID
		);
	}

	let previousSectionID = -1;
	if (sIdx !== -1) {
		previousSectionID = existingProposal.sections[sIdx].sectionID;
	}

	// Add section ID into question filed
	existingProposal.questions[questionIndex].sectionID = sectionID;

	// Add question ID into question array of section filed
	if (existingProposal.sections[sectionIndex].questions.includes(questionID)) {
		throw new Error(
		`Section ${sectionID} has already connected with ${questionID}`
		);
	}

	existingProposal.sections[sectionIndex].questions.push(questionID);

	const updated = {
		userEmail,
		operationType: OPERATION_TYPE.EDIT,
		section: {
			previousSectionID,	// -1 if no previous section
			currentSectionID: sectionID,
			questions: [questionID],
		}
	}
	await createOrUpdateSection(proposalRef, existingProposal, updated);

	// Update proposal Ref
	await proposalRef.set(existingProposal);
	req.log = {
					proposalID: proposalID,
					actionType: OPERATION_TYPE.EDIT,
					details: ` new question assigned to ${sectionID}`,
				}
	// Return Json message
	return "Assign Question Successfully!";
}

exports.assignQuestion= async function (req, res,next) {
	if (req.method === "PUT") {
		try {

		const restoreResult = await assignQuestionToSection(req.body, req);

		res.status(200).json({ message: restoreResult });
		
				next()
		} catch (error) {
		// console.error("Error handling restore request:", error);

		if (error.message.includes("not found")) {
			res.status(404).json({ error: error.message });
		} else if (error.message.includes("has been deleted")) {
			res.status(400).json({ error: error.message });
		} else {
			res.status(500).json({ error: error.message });
		}
		}
	} else {
		res.status(405).json({ error: "Method not allowed" });
	}
}
