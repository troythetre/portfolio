import { db, verifyToken } from "./firebase";
import { addAnswerTask} from "./taskFunctions"

export default async function handler(req, res) {
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
        const { proposalID, questionID, writer } = req.body;

        // Retrieve the existing proposal document
        const proposalSnapshot = await db.collection("proposals").doc(proposalID).get();

        // Check if the proposal document exists
        if (!proposalSnapshot.exists) {
          res.status(404).json({ message: "Proposal not found!" });
          return;
        }

        const existingProposal = proposalSnapshot.data();

        // Check if the proposal is deleted
        if (existingProposal.isDeleted?.status) {
            res.status(400).json({ error: 'Proposal is marked as deleted' });
            return;
        }

        // Find the question with the specified questionID
        const existingQuestion = existingProposal.questions.find((q) => q.questionID === questionID);

        if (!existingQuestion) {
          res.status(404).json({ message: "Question not found!" });
          return;
        }

        // check if question is deleted 
        if (existingQuestion.isDeleted?.status) {
          res.status(400).json({ error: 'Question is marked as deleted' });
          return;
        }

        //get registered user emails
        const registeredUsers = await db.collection('users').get();
        const userEmails = [];

        registeredUsers.forEach((doc)=> {
          const user = doc.data().email;
          userEmails.push(user);
        })

        //check if user is registered in database
        const emailAddress = writer.email;
        if(!userEmails.includes(emailAddress)) {
          res.status(401).json({ error: "User not registered in database"})
          return;
        }

        // Make sure deadline is a date
        if (!isValidDate(writer.deadline)) {
            res.status(400).json({ error: "Invalid deadline format. Use YYYY-MM-DD." });
            return;
        }

        //check if deadline is a date
        const date = Date.parse(writer.deadline);
        if(!date) {
          res.status(401).json({ error: "Deadline must be a date"})
          return;
        }

        //check for writer in writers' array by email
        let questionWriter;
        let length = existingQuestion.writers.length;
        for(let index = 0; index < length; index++) {
          const currentWriter = existingQuestion.writers[index];
          if(currentWriter.email === writer.email) {
            questionWriter = currentWriter;
          }
        }

        // validate question writer is a team member 
        let member = existingProposal.teamMembers.find(member => member.userEmail === writer.email);
        if(!member) {
          res.status(401).json({ error: "writer isn't a team member"});
          return;
        }

        //update exisiting writer's deadline or add new writer to array
        if(questionWriter) {
          questionWriter.deadline = writer.deadline;
        } else {
          existingQuestion.writers.push(writer);
        }
        

        // Update the proposal document with the modified question
        await proposalSnapshot.ref.update({ questions: existingProposal.questions });

        //add answer task to user
        await addAnswerTask(writer.email,proposalID, questionID, writer.deadline)



        res.status(200).json({ message: "Writer added successfully!" });
      } else {
        res.status(401).json({ error: "Invalid authentication token" });
      }
    } catch (error) {
      console.error("Error adding writer:", error);
      res.status(500).json({ error: "Error adding writer" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
} 
function isValidDate(dateString) {
    // Regular expression to match the date format (YYYY-MM-DD)
    const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[1-2]\d|3[01])$/;
    return dateRegex.test(dateString);
  }