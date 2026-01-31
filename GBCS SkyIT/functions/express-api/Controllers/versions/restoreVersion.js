const { db } = require("../../firebase");
const { Timestamp, ProposalMutableFields } = require("../../helperFunctions");
const { reverseChanges, getChangesAfterTimestamp, getProposal } = require("../versions/getSpecificVersion");
const { PROPOSAL_CONTENT } = require("../../voopConstants");

exports.restoreVersion = async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const { proposalID, seconds, nanoseconds } = req.params;
      const existingProposal = await getProposal(proposalID, res);
      const versionHistory = existingProposal?.versionHistory ?? [];
      if (versionHistory.length === 0) {
        res.status(404).json({ message: "No versionHistory found!" })
      }

      const targetTimestamp = new Timestamp(seconds, nanoseconds)
      const changesAfterTimeStamp = getChangesAfterTimestamp(versionHistory, targetTimestamp);
      const currVersion = JSON.parse(JSON.stringify(existingProposal)); // Deep copy
      const restoreVersion = reverseChanges(changesAfterTimeStamp, existingProposal);

      const storedSnapshotSuccess = await storeProposalSnapshot(
        proposalID,
        existingProposal,
        currVersion,
        restoreVersion,
        versionHistory[versionHistory.length - 1].createdAt
      );

      if (storedSnapshotSuccess) {
        await restoreProposal(proposalID, restoreVersion);
      }
      
      res.status(200).json({message: restoreVersion});
    } catch (error) {
      const errorMessage = error.message || 'Unknown error';
      res.status(500).json({ error: `Error getting a version. `, message: `${errorMessage}` });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

/**
 * This function stores two different snapshot versions of the proposal in the database.
 * The first snapshot is the version before the restore operation. (currVersion)
 * The second snapshot is the version after the restore operation. (restoreVersion)
 * When a user restores at 11:00 AM, this function will store the snapshot at the latest 
 * change time before 11:00 AM and the snapshot at 11:00 AM.
 * @param {String} proposalID 
 * @param {DocumentData} existingProposal 
 * @param {String<Json>} currVersion 
 * @param {DocumentData} restoreVersion 
 * @param {String} lastChangeTime 
 * @returns {Promise<Boolean>} true if the snapshot was successfully stored
 */
async function storeProposalSnapshot(
  proposalID,
  existingProposal,
  currVersion,
  restoreVersion,
  lastChangeTime
) {
  const versionSnapshot = existingProposal?.versionSnapshot ?? [];
  const currTime = new Date();

  const currContent = new ProposalMutableFields(
    currVersion.questions,
    currVersion.sections,
    currVersion.mediaFiles,
    currVersion.colors,
    currVersion.pages,
    currVersion.clientLogo
  ).toObject();
  const contentToRestore = new ProposalMutableFields(
    restoreVersion.questions,
    restoreVersion.sections,
    restoreVersion.mediaFiles,
    restoreVersion.colors,
    restoreVersion.pages,
    restoreVersion.clientLogo
  ).toObject();

  versionSnapshot.push({versionTimestamp: lastChangeTime, content: currContent});
  versionSnapshot.push({versionTimestamp: currTime, content: contentToRestore});

  const proposalRef = db.collection("proposals").doc(proposalID);
  const proposalSnapshot = await proposalRef.get();
  proposalSnapshot.ref.update({versionSnapshot: versionSnapshot});
  return true;
}

/**
 * Perform restoration
 * @param {String} proposalID 
 * @param {DocumentData} restoreVersion 
 */
async function restoreProposal(proposalID, restoreVersion) {
  const proposalRef = db.collection("proposals").doc(proposalID);
  const proposalSnapshot = await proposalRef.get();
  console.log(restoreVersion["questions"]);

  // Update each mutable field in the proposal document using the version to restore
  for (const field of Object.keys(PROPOSAL_CONTENT)) {
    const updateObj = {};
    const fieldName = PROPOSAL_CONTENT[field];
    updateObj[fieldName] = restoreVersion[fieldName];
    proposalSnapshot.ref.update(updateObj);
  }
}