const {db} = require("../../firebase");
const {newChange, createVersionHistory} = require("../../helperFunctions");
const {PROPOSAL_CONTENT, OPERATION_TYPE} = require("../../voopConstants");
const {getProposal} = require("../versions/getSpecificVersion");

exports.updateColors = async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const {proposalID, newColors} = req.body; // note: newColors { clientColors: [], ourColor: [] }
      const userEmail = req.user.email;
      const existingProposal = await getProposal(db, proposalID, res);
      const proposalRef = db.collection("proposals").doc(proposalID);
      
      await addColorHistory(proposalRef, userEmail, newColors, existingProposal);
      await updateColorEntry(proposalRef, newColors);

      res.status(200).json({message: "Color updated successfully!"});
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      res.status(500).json({error: `Error updating colors. `, message: `${errorMessage}`});
    }
  } else {
    res.status(405).json({error: "Method not allowed"});
  }
};

async function updateColorEntry(proposalRef, newColors) {
  const updateContent = {};
  updateContent[PROPOSAL_CONTENT.COLORS] = newColors;
  await proposalRef.update(updateContent);
}

async function addColorHistory(proposalRef, userEmail, newColors, existingProposal) {
  const previousColors = existingProposal?.colors ?? { clientColors: [], ourColor: [] };
  const existingVersionHistory = existingProposal?.versionHistory ?? [];
  const latestVersionIndex = existingVersionHistory.length - 1;
  const colorsHistory = {
    previousColors: previousColors,
    newColors: newColors,
  };
  const time = new Date();

  const newChangeValue = newChange(
    userEmail,
    OPERATION_TYPE.EDIT,
    PROPOSAL_CONTENT.COLORS,
    colorsHistory
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