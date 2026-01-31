import { db, verifyToken } from "./firebase";
import {
  PROPOSAL_STATUS,
  PROPOSAL_TYPE,
  DEFAULT_DUE_DATES,
} from "./voopConstants";
import {
  isValidDate,
  validateTeamMembers,
  generateDeadline,
  generateNewProposalID,
} from "./helperFunctions";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const bearerToken = req.headers.authorization?.split(" ")[1];

      if (!bearerToken) {
        res.status(401).json({ error: "Missing authentication token" });
        return;
      }

      // Verify the Firebase ID token 
      const isTokenValid = await verifyToken(bearerToken);

      if (isTokenValid) {
        const {
          name,
          teamMembers,
          proposalType,
          milestones,
          proposal_deadline,
          templates,
          ourColors,
          clientColors,
          isConsulting,
          softwareType,
          companyNames,
        } = req.body;

        //  generate a new ID
        const newProposalInfo = await generateNewProposalID();

        // Create a new proposal document
        const newProposal = {
          proposalID: newProposalInfo.proposalID,
          proposalNumber: newProposalInfo.proposalNumber,
          name: name,
          createdAt: new Date(),
          lastModified: new Date(),
          proposal_deadline:
            isValidDate(proposal_deadline) &&
            new Date(proposal_deadline) >= new Date()
              ? isValidDate(proposal_deadline)
              : generateDeadline(DEFAULT_DUE_DATES.PPOPOSAL_DUE), //check if given date is valid, if not generate one 15 days from creation date
          status: PROPOSAL_STATUS.INPROGRESS, //set default status as inprogress
          proposalType: Object.values(PROPOSAL_TYPE).includes(
            proposalType.toLowerCase()
          )
            ? proposalType.toLowerCase()
            : PROPOSAL_TYPE.DIGITAL, //check if given type is valid, if not set digital as default type
          teamMembers: await validateTeamMembers(teamMembers),
          milestones: milestones.filter((milestone) => {
            //only milestones with valid dates are saved
            if (
              isValidDate(milestone.date) &&
              new Date(milestone.date) >= new Date()
            ) {
              milestone.date = isValidDate(milestone.date);
              return milestone;
            }
          }),
          templates: [] || templates,
          companyNames: companyNames,
          softwareType: softwareType,
          colors: {
            ourColor: [] || ourColors,
            clientColors: [] || clientColors,
          },
          isDeleted: {
            status: false,
            deleteBy: "",
            deletionDate: null,
          },
          isConsulting: typeof isConsulting === Boolean ? isConsulting : true,
          mediaFiles: [],
          questions: [],
          sections: [],
          bookmarkedBy: [],
          approver: {},
          pages: [],
          pdfFiles: [],
          statusChangeNotes: [],
          clientLogo: {
            fileName: "",
            fileURL: "",
            fileType: "",
            templateLocationRef: "",
          },
        };

        // Create a new proposal using set() method
        await db
          .collection("proposals")
          .doc(newProposalInfo.proposalID)
          .set(newProposal);

        res
          .status(200)
          .json({
            message: "Proposal created successfully!",
            proposalID: newProposalInfo.proposalID,
          });
      } else {
        res.status(401).json({ error: "Invalid authentication token" });
      }
    } catch (error) {
      console.error("Error creating proposal:", error);
      res.status(500).json({ error: "Error creating proposal" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
