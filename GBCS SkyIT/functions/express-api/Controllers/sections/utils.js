const { newChange, createVersionHistory } = require("../../helperFunctions");
const { PROPOSAL_CONTENT } = require("../../voopConstants");
const _ = require('lodash');

exports.createOrUpdateSection = async (db, existingProposal, updated) => {
    const {  userEmail, operationType, section } = updated;

    const existingVersionHistory = existingProposal?.versionHistory || [];
    const time = new Date();
    const latestVersionIndex = existingVersionHistory.length - 1;

    // Compare new objects with only the fields: type, field, value
    const compareFields = ['type', 'field', 'value'];
    const newChangeValue = newChange(userEmail, operationType, PROPOSAL_CONTENT.SECTIONS, section).toObject();

    const createOrUpdateChange = () => {
        const latestChanges = existingVersionHistory[latestVersionIndex].changes;

        // Check if there is a change in latestChanges that matches the selected fields
        if (!latestChanges.some(change => _.isEqual(_.pick(change, compareFields), _.pick(newChangeValue, compareFields)))) {
            // Add a new change only if the same questionID and answer are not already in the changes
            existingVersionHistory[latestVersionIndex].changes.push(newChangeValue);
        }
    };

    // Aggregate within a 1-minute period 
    if (existingVersionHistory.length === 0 || time.getTime() - existingVersionHistory[latestVersionIndex].createdAt._seconds * 1000 > 60000) {
        existingVersionHistory.push(createVersionHistory([newChangeValue], time));
    } else {
        createOrUpdateChange();
    }

    // Update the proposal document with the modified questions array
    await db.update({ sections: existingProposal.sections, versionHistory: existingVersionHistory });

}