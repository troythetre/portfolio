import { db } from "./firebase";
// Helper function to validate the general proposal status
export function validateProposalStatus(status, PROPOSAL_STATUS) {
  if (Object.values(PROPOSAL_STATUS).includes(status.toLowerCase())) {
    return status.toLowerCase();
  } else {
    return PROPOSAL_STATUS.INPROGRESS; // Set default status to 'in progress' if not a valid status
  }
}

export function isValidDate(dateString) {
  // Regular expression to match the date format (YYYY-MM-DD)
  const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/;
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate) && parsedDate instanceof Date) {
    if (dateRegex.test(dateString)) {
      return dateString;
    } else {
      // Format the deadline as YYYY-MM-DD
      const formattedDeadline = `${parsedDate.getFullYear()}-${(
        parsedDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${parsedDate.getDate().toString().padStart(2, "0")}`;

      return formattedDeadline;
    }
  } else return false;
}

export async function validateTeamMembers(teamMembers) {
  // Retrieve users email info from the database
  const usersSnapshot = await db.collection("users").get();
  const validTeamMembers = [];

  // Set to store unique users
  const uniqueUsers = new Set();

  // Add the user to the Set to track uniqueness
  usersSnapshot.forEach((doc) => {
    const user = doc.data().email;
    if (user && !uniqueUsers.has(user)) {
      uniqueUsers.add(user);
    }
  });

  //check if given teamMembers are registered users
  teamMembers.forEach((member) => {
    if (uniqueUsers.has(member.userEmail)) validTeamMembers.push(member);
  });
  return validTeamMembers;
}

export function generateDeadline(daysNUm) {
  // Get the current date
  const today = new Date();

  // Calculate the deadline by adding 15 days
  const deadline = new Date(today);
  deadline.setDate(deadline.getDate() + daysNUm);

  // Format the deadline as YYYY-MM-DD
  const formattedDeadline = `${deadline.getFullYear()}-${(
    deadline.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${deadline.getDate().toString().padStart(2, "0")}`;

  return formattedDeadline;
}

// Function to generate a new proposalID
export async function generateNewProposalID() {
  let proposalNumber = 1; // Default proposal number
  // Get the highest proposal number used so far
  const highestProposalSnapshot = await db
    .collection("proposals")
    .orderBy("proposalNumber", "desc")
    .limit(1)
    .get();

  if (!highestProposalSnapshot.empty) {
    const highestProposal = highestProposalSnapshot.docs[0].data();
    proposalNumber = highestProposal.proposalNumber + 1;
  }

  return {
    proposalID: `RFP${proposalNumber}`,
    proposalNumber: proposalNumber,
  };
}
