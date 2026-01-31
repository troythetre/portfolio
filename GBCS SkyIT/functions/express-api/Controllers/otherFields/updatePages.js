const { db } = require("../../firebase");
const { newChange, createVersionHistory } = require("../../helperFunctions");
const { PROPOSAL_CONTENT, OPERATION_TYPE } = require("../../voopConstants");
const { getProposal } = require("../versions/getSpecificVersion");

exports.updatePages = async function handler(req, res) {
  if (req.method === "POST") {
    try {

      // note: pages is an array of objects
      const { proposalID, newPages } = req.body;
      const userEmail = req.user.email;
      const existingProposal = await getProposal(db, proposalID, res);
      const proposalRef = db.collection("proposals").doc(proposalID);

      await addPagesHistory(proposalRef, userEmail, newPages, existingProposal);
      await updatePagesEntry(proposalRef, newPages);

      res.status(200).json({message: "Pages updated successfully!"});
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      res.status(500)
        .json({error: `Error updating pages. `, message: `${errorMessage}`});
    }
  } else {
    res.status(405).json({error: "Method not allowed"});
  }
};

async function updatePagesEntry(proposalRef, newPages) {
  const updateContent = {};
  updateContent[PROPOSAL_CONTENT.PAGES] = newPages;
  await proposalRef.update(updateContent);
}

async function addPagesHistory(
  proposalRef,
  userEmail,
  newPages,
  existingProposal
) {
  const previousPages = existingProposal?.pages ?? [];
  const existingVersionHistory = existingProposal?.versionHistory ?? [];
  const latestVersionIndex = existingVersionHistory.length - 1;
  const pagesHistory = {
    previousPages: previousPages,
    newPages: newPages,
  };
  const time = new Date();

  const newChangeValue = newChange(
    userEmail, 
    OPERATION_TYPE.EDIT,
    PROPOSAL_CONTENT.PAGES,
    pagesHistory
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
