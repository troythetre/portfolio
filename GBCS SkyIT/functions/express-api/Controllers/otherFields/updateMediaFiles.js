const { db } = require("../../firebase");
const { newChange, createVersionHistory } = require("../../helperFunctions");
const { PROPOSAL_CONTENT, OPERATION_TYPE } = require("../../voopConstants");
const { getProposal } = require("../versions/getSpecificVersion");

exports.updateMediaFiles = async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { proposalID, mediaFiles } = req.body; // note: mediaFiles is an array of objects
      const userEmail = req.user.email;
      const existingProposal = await getProposal(db, proposalID, res);
      const proposalRef = db.collection("proposals").doc(proposalID);

      await addMediaFilesHistory(proposalRef, userEmail, mediaFiles, existingProposal);
      await updateMediaFilesEntry(proposalRef, mediaFiles);

      res.status(200).json({message: "Media files updated successfully!"});
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      res.status(500)
        .json({error: `Error updating media files. `, message: `${errorMessage}`});
    }
  } else {
    res.status(405).json({error: "Method not allowed"});
  }
};

async function updateMediaFilesEntry(proposalRef, newMediaFiles) {
  const updateContent = {};
  updateContent[PROPOSAL_CONTENT.MEDIA_FILES] = newMediaFiles;
  await proposalRef.update(updateContent);
}

async function addMediaFilesHistory(
  proposalRef,
  userEmail,
  newMediaFiles,
  existingProposal
) {
  const previousMediaFiles = existingProposal?.mediaFiles ?? [];
  const existingVersionHistory = existingProposal?.versionHistory ?? [];
  const latestVersionIndex = existingVersionHistory.length - 1;
  const mediaFilesHistory = {
    previousMediaFiles: previousMediaFiles,
    newMediaFiles: newMediaFiles,
  };
  const time = new Date();

  const newChangeValue = newChange(
    userEmail, 
    OPERATION_TYPE.EDIT,
    PROPOSAL_CONTENT.MEDIA_FILES,
    mediaFilesHistory
  ).toObject();

  // Aggregate within a 1-minute period
  if (
    existingVersionHistory.length <= 0 ||
    time.getTime() -
      existingVersionHistory[latestVersionIndex].createdAt._seconds * 1000 > 60000
  ) {
    existingVersionHistory.push(createVersionHistory([newChangeValue], time));
  } else {
    existingVersionHistory[latestVersionIndex].changes.push(newChangeValue);
  }

  await proposalRef.update({versionHistory: existingVersionHistory});
}
