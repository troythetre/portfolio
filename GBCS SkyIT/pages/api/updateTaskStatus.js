import { db, decodeToken } from "./firebase";

/*  # 195
    Create an API endpoint that updates the task status to completed or incomplete
    The API endpoint will receive the proposalID, taskType(write/answer/approve)
        and/or questionID(depending on taskType)
    get the userEmail from the current logged in user
 */

export default async function handler(req, res) {
  if (req.method === "PUT") {
    try {
      const decodedToken = await tokenCheck(req, res);
      const userID = decodedToken.email;
      const { proposalID, taskType, questionID } = req.body;
      if (proposalID === undefined) { res.status(400).json({ error: "proposalID is required" }); return; }
      if (taskType === undefined) { res.status(400).json({ error: "taskType is required" }); return; }

      const taskRef = db.collection("tasks").doc(userID);
      const taskSnapshot = await taskRef.get();
      if (!taskSnapshot.exists) {
        // Task not found, return object with fields set as an error message.
        res.status(404).json({ error: "Task not found" });
        return;
      }

      const taskData = taskSnapshot.data();
      if (taskData.hasOwnProperty(proposalID)) {
        switch (taskType) {
          case "answer":
            await updateAnswerStatus(taskRef, proposalID, taskData, questionID, res);
            break;
          case "review":
            await updateReviewStatus(taskRef, proposalID, taskData, questionID, res);
            break;
          case "approve":
            await updateApproveStatus(taskRef, proposalID, taskData, questionID, res);
            break;
          default:
            res.status(404).json({ error: "Tasktype not supported" });
            break;
        }
      } else {
        res.status(404).json({ error: "Proposal not found" });
      }

    } catch (error) {
      console.error("Error update task's status: ", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

async function tokenCheck(req, res) {
  const bearerToken = req.headers.authorization?.split(" ")[1];

  if (!bearerToken) {
    res.status(401).json({ error: "Missing authentication token" });
    return;
  }

  const decodedToken = await decodeToken(bearerToken);

  if (!decodedToken || !decodedToken.email) {
    res.status(401).json({ error: "Invalid authentication token" });
    return;
  }

  return decodedToken;
}

async function updateAnswerStatus(taskRef, proposalID, taskData, questionID, res) {
  const answerCollection = taskData[proposalID]?.answer;
  if (!answerCollection) {
    res.status(404).json({ error: "No 'answer' data found for proposalID " + proposalID });
    return;
  }

  const foundQuestion = answerCollection.find(question => question.questionID === questionID);
  if (foundQuestion) {
    foundQuestion.isCompleted = !foundQuestion.isCompleted;
    try {
      await taskRef.update({
        [`${proposalID}.answer`]: answerCollection
      });
      res.status(200).json({ message: "Update status complete." });
    } catch (error) {
      console.error('Error updating answer status:', error);
      res.status(500).json({ error: 'Error updating question status in the database' });
    }
  } else {
    res.status(404).json({ error: "No question found for ID [" + questionID + "]" });
  }
}

async function updateReviewStatus(taskRef, proposalID, taskData, questionID, res) {
  const reviewData = taskData[proposalID]?.review;
  if (!reviewData) {
    res.status(404).json({ error: "No 'review' data found for proposalID " + proposalID });
    return;
  }

  const reviewQuestion = reviewData.find(question => question.questionID === questionID);
  if (reviewQuestion) {
    reviewQuestion.isCompleted = !reviewQuestion.isCompleted;

    try {
      // Update the review in the Firebase database
      await taskRef.update({
        [`${proposalID}.review`]: reviewData
      });
      res.status(200).json({ message: "Update status complete." });
    } catch (error) {
      res.status(500).json({ error: 'Error updating question status in the database' });
    }

  } else {
    res.status(404).json({ error: "No question found for ID [" + questionID + "]" });
  }
}

async function updateApproveStatus(taskRef, proposalID, taskData, questionID, res) {
  const approveData = taskData[proposalID]?.approve;
  if (!approveData) {
    res.status(404).json({ error: "No 'approve' data found for proposalID " + proposalID });
    return;
  }
  // check if is to update proposal's state i.e. no questionID needed
  if (questionID === undefined) {
    const proposalApproveData = approveData.proposal;
    console.log(proposalApproveData);
    if (!proposalApproveData) {
      res.status(404).json({ error: "No 'proposal' found for approval of proposalID " + proposalID });
      return;
    }

    const proposalApprove = proposalApproveData.find(proposal => proposal.proposalID === proposalID);
    if (proposalApprove) {
      console.log(proposalApprove);
      proposalApprove.isCompleted = !proposalApprove.isCompleted
      try {
        await taskRef.update({
          [`${proposalID}.approve.proposal`]: proposalApproveData
        });
        res.status(200).json({ message: "Update status complete." });
      } catch (error) {
        res.status(500).json({ error: 'Error updating proposal status in the database' });
      }
    } else {
      res.status(404).json({ error: "No proposal for approval found for ID [" + proposalID + "]" });
    }

    // update a question's state
  } else {
    const questionApproveData = approveData.question;
    console.log(questionApproveData);
    if (!questionApproveData) {
      res.status(404).json({ error: "No 'question' found for approval for ID [" + questionID + "]" });
      return;
    }

    const approveQuestion = questionApproveData.find(question => question.questionID === questionID);
    if (approveQuestion) {
      approveQuestion.isCompleted = !approveQuestion.isCompleted;
      try {
        await taskRef.update({
          [`${proposalID}.approve.question`]: questionApproveData
        });
        res.status(200).json({ message: "Update status complete." });
      } catch (error) {
        res.status(500).json({ error: 'Error updating question status in the database' });
      }
    } else {
      res.status(404).json({ error: "No question found for approval for ID [" + questionID + "]" });
    }
  }
}