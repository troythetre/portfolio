import { db, verifyToken } from "./firebase";
import { addApproveProposalTask } from "./taskFunctions";
import { PROPOSAL_STATUS, DEFAULT_DUE_DATES } from "./voopConstants";
import { isValidDate, generateDeadline } from "./helperFunctions";

export default async function handler(req, res) {
  // put rather than post because you are updating
  if (req.method === "PUT") {
    try {
      const bearerToken = req.headers.authorization?.split(" ")[1];

      if (!bearerToken) {
        res.status(401).json({ error: "Missing authentication token" });
        return;
      }

      // Verify the Firebase ID token
      const isTokenValid = await verifyToken(bearerToken);

      if (isTokenValid) {
        const { proposalID, approverEmail, approvalDeadline } = req.body;

        //attempt to the appover user on db
        const findUser = await db
          .collection("users")
          .where("email", "==", approverEmail)
          .get();

        if (!findUser.empty) {
          //if found
          // Assuming email is unique, get the user data
          const userRecord = findUser.docs[0].data();

          if (
            userRecord.hasOwnProperty("role") &&
            userRecord.role === "admin"
          ) {
            //check if the user is an admin
            // Retrieve the existing proposal document
            const proposalSnapshot = await db
              .collection("proposals")
              .doc(proposalID)
              .get();

            // Check if the proposal document exists or not
            if (!proposalSnapshot.exists) {
              res.status(404).json({ message: "Proposal not found!" });
              return;
            }
            const existingProposal = proposalSnapshot.data();

            // Check if the proposal document has been deleted
            if (existingProposal.isDeleted.status) {
              res.status(500).json({ message: "Proposal has been deleted" });
              return;
            }

            //if the given deadline is invalid, set the approvalDeadline to 2 days from the request date
            const validApprovalDeadline =
              isValidDate(approvalDeadline) &&
              new Date(approvalDeadline) < new Date(existingProposal.createdAt)
                ? isValidDate(approvalDeadline)
                : generateDeadline(DEFAULT_DUE_DATES.PROPOSAL_APPROVAL);

            //check the current proposal status, if not under review,
            if (existingProposal.status !== PROPOSAL_STATUS.REVIEW) {
              // set the approver and update the status to under review
              existingProposal.approver = {
                email: approverEmail,
                deadline: validApprovalDeadline,
              };
              existingProposal.status = PROPOSAL_STATUS.REVIEW;

              // Update the proposal document with the modified information
              await proposalSnapshot.ref.update({
                approver: existingProposal.approver,
                status: existingProposal.status,
              });

              //add this task to the user's task list
              await addApproveProposalTask(
                approverEmail,
                proposalID,
                validApprovalDeadline,
                "Approve RFP"
              );
              res.status(200).json({
                message: "Request for Appoval Submitted successfully!",
              });
              return;
            } else {
              res
                .status(200)
                .json({ message: "The Proposal is currently Under Review!" });
              return;
            }
          } else {
            res
              .status(400)
              .json({ error: "Only Admin can Approve this Proposal" });
            return;
          }
        } else {
          res.status(404).json({ error: "User not found" });
          return;
        }
      } else {
        res.status(401).json({ error: "Invalid authentication token" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error requesting Approval" + error });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
