const { db } = require("../../firebase");
const { Timestamp } = require("../../helperFunctions");
const { PROPOSAL_CONTENT } = require("../../voopConstants");

/**
 * Returns a specific version of the proposal using the proposalID and timestamp
 * @param {*} req 
 * @param {*} res 
 */
exports.getSpecificVersion = async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { proposalID, seconds, nanoseconds } = req.params;
      const existingProposal = await getProposal(db, proposalID, res);
      const versionHistory = existingProposal?.versionHistory ?? [];
      if (versionHistory.length === 0) {
        res.status(404).json({ message: "No versionHistory found!"})
      }

      const targetTimestamp = new Timestamp(seconds, nanoseconds)
      const changesAfterTimeStamp = getChangesAfterTimestamp(versionHistory, targetTimestamp);
      const specificVersion = reverseChanges(changesAfterTimeStamp, existingProposal);
      res.status(200).json({ message: specificVersion });
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      res.status(500).json({ error: `Error getting a version. ${errorMessage}` });
    }
  } else {
  res.status(405).json({ error: "Method not allowed" });
  }
}

const reverseChanges = (changesAfterTimeStamp, existingProposal) => {
  for (let i = changesAfterTimeStamp.length - 1; i >= 0; i--) {
    const change = changesAfterTimeStamp[i];
    const fieldToUpdate =  existingProposal[change.field];

    switch (change.field) {
      case PROPOSAL_CONTENT.QUESTIONS:
        reverseChangesQuestion(changesAfterTimeStamp, i, fieldToUpdate, existingProposal);
        break;
      case PROPOSAL_CONTENT.SECTIONS:
        reverseChangesSection(changesAfterTimeStamp, i, fieldToUpdate, existingProposal);
        break;
      // TODO: Add other fields
    }


  }

  return existingProposal;
}

function reverseChangesQuestion(changesAfterTimeStamp,
  i,
  fieldToUpdate,
  existingProposal
) {
  const change = changesAfterTimeStamp[i];
  const questionID = change.value.questionID;
  if (change.type === "add") {
    // If it was an 'add' type change, remove the question with the given questionID
    fieldToUpdate = fieldToUpdate.filter(
      (question) => question.questionID !== questionID
    );
  } else if (change.type === "delete") {
    // If it was a 'delete' type change, add back the deleted question with the given questionID
    const deletedQuestion = changesAfterTimeStamp.find(
      (change) =>
        change.type === "add" && change.value.questionID === questionID
    );
    if (deletedQuestion) {
      fieldToUpdate.push(deletedQuestion.value);
    }
  } else if (change.type === "edit") {
    // If it was an 'edit' type change, replace the question with the given questionID with the old value
    const editedQuestion = changesAfterTimeStamp.find(
      (change) =>
        change.type === "edit" && change.value.questionID === questionID
    );
    if (editedQuestion) {
      const questionIndex = fieldToUpdate.findIndex(
        (question) => question.questionID === questionID
      );
      const fieldsToUpdate = Object.keys(change.value);
      for (const field of fieldsToUpdate) {
        console.log("before:", fieldToUpdate[questionIndex][field]);

        fieldToUpdate[questionIndex][field] = change.value[field];
        console.log("after", fieldToUpdate[questionIndex][field]);
        console.log("newval:", change.value[field]);
        console.log("field:", field);
      }
    }
  }
  existingProposal[change.field] = fieldToUpdate;
}

function reverseChangesSection(
  changesAfterTimeStamp,
  i,
  fieldToUpdate,
  existingProposal
) {
    const change = changesAfterTimeStamp[i];
    const sectionID = change.value.sectionID;
    if (change.type === "add") {
      // If it was an 'add' type change, remove the question with the given questionID
      fieldToUpdate = fieldToUpdate.filter(
        (question) => question.questionID !== questionID
      );
    } else if (change.type === "delete") {
      // If it was a 'delete' type change, add back the deleted question with the given questionID
      const deletedQuestion = changesAfterTimeStamp.find(
        (change) =>
          change.type === "add" && change.value.questionID === questionID
      );
      if (deletedQuestion) {
        fieldToUpdate.push(deletedQuestion.value);
      }
    } else if (change.type === "edit") {
      // If it was an 'edit' type change, replace the question with the given questionID with the old value
      const editedQuestion = changesAfterTimeStamp.find(
        (change) =>
          change.type === "edit" && change.value.questionID === questionID
      );
      if (editedQuestion) {
        const questionIndex = fieldToUpdate.findIndex(
          (question) => question.questionID === questionID
        );
        const fieldsToUpdate = Object.keys(change.value);
        for (const field of fieldsToUpdate) {
          console.log("before:", fieldToUpdate[questionIndex][field]);

          fieldToUpdate[questionIndex][field] = change.value[field];
          console.log("after", fieldToUpdate[questionIndex][field]);
          console.log("newval:", change.value[field]);
          console.log("field:", field);
        }
      }
    }
    existingProposal[change.field] = fieldToUpdate;
}


const getChangesAfterTimestamp = (versionHistory, targetTimestamp) => {
  const filteredChanges = [];

  for (const entry of versionHistory) {
    // Compare with the target timestamp
    const entryTimestamp = new Timestamp(entry.createdAt._seconds, entry.createdAt._nanoseconds);

    if (entryTimestamp.isGreaterThan(targetTimestamp)) {
      filteredChanges.push(...entry.changes);
    }
  }

  return filteredChanges;
}

const getProposal = async (db, proposalID, res) => {
  // Retrieve the existing proposal document
  const proposalRef = db.collection('proposals').doc(proposalID);
  const proposalSnapshot = await proposalRef.get();

  // Check if the proposal document exists
  if (!proposalSnapshot.exists) {
    res.status(404).json({ message: 'Proposal not found!' });
  }

  const existingProposal = proposalSnapshot.data();

  // Check if the proposal is marked as deleted
  if (existingProposal.isDeleted.status) {
    res.status(400).json({ message: 'Proposal has been deleted!' });
  }

  return existingProposal;
}

exports.reverseChanges = reverseChanges;
exports.getChangesAfterTimestamp = getChangesAfterTimestamp;
exports.getProposal = getProposal;


