const {db} = require("../../firebase");
const {newChange, createVersionHistory} = require("../../helperFunctions");
const {PROPOSAL_CONTENT, OPERATION_TYPE} = require("../../voopConstants");
const {getProposal} = require("../versions/getSpecificVersion");

exports.updateClientLogo = async function handler(req, res) {
  if (req.method === "POST") {
    try {
      
      // newClientLogo: {fileName, fileType, fileURL, templateLocationRef}
      const {proposalID, newClientLogo} = req.body;
      if (
        !newClientLogo ||
        !newClientLogo.fileName ||
        !newClientLogo.fileType ||
        !newClientLogo.fileURL ||
        !newClientLogo.templateLocationRef
      ) {
        res.status(422).json({ error: "Invalid client logo data." });
        return;
      }
      
      const userEmail = req.user.email;
      const existingProposal = await getProposal(db, proposalID, res);
      const proposalRef = db.collection("proposals").doc(proposalID);
      
      await addClientLogoHistory(proposalRef, userEmail, newClientLogo, existingProposal);
      await updateClientLogoEntry(proposalRef, newClientLogo);

      res.status(200).json({message: "Client logo updated successfully!"});
    } catch (error) {
      const errorMessage = error.message || "Unknown error";
      res.status(500).json({error: `Error updating client logo.`, message: `${errorMessage}`});
    }
  } else {
    res.status(405).json({error: "Method not allowed"});
  }
};

async function updateClientLogoEntry(proposalRef, newClientLogo) {
  const updateContent = {};
  updateContent[PROPOSAL_CONTENT.CLIENT_LOGO] = newClientLogo;
  await proposalRef.update(updateContent);
}

async function addClientLogoHistory(proposalRef, userEmail, newClientLogo, existingProposal) {
  const previousClientLogo = existingProposal?.clientLogo ?? { fileName: "", fileType: "", fileURL: "", templateLocationRef: "" };
  const existingVersionHistory = existingProposal?.versionHistory ?? [];
  const latestVersionIndex = existingVersionHistory.length - 1;
  const clientLogoHistory = {
    previousClientLogo: previousClientLogo,
    newClientLogo: newClientLogo,
  };
  const time = new Date();

  const newChangeValue = newChange(
    userEmail,
    OPERATION_TYPE.EDIT,
    PROPOSAL_CONTENT.CLIENT_LOGO,
    clientLogoHistory
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