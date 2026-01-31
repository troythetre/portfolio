import { db, verifyToken } from "./firebase";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { proposalID, questionID } = req.query;

      if (!proposalID || !questionID) {
        res.status(400).json({ error: 'Missing proposalID or questionID' });
        return;
      }

      console.log(`Fetching question ${questionID} from proposal ${proposalID}...`);
      
      const proposalRef = db.collection('proposals').doc(proposalID);
      const proposalSnapshot = await proposalRef.get();

      if (!proposalSnapshot.exists) {
        res.status(404).json({ error: 'Proposal not found' });
        return;
      }

      const proposalData = proposalSnapshot.data();
      const question = proposalData.questions.find(q => q.questionID === questionID);

      if (!question) {
        res.status(404).json({ error: 'Question not found in proposal' });
        return;
      }

      // Check if the proposal or question is deleted
      if (proposalData.isDeleted && proposalData.isDeleted.status) {
        res.status(404).json({ error: 'Proposal is deleted' });
        return;
      }

      if (question.isDeleted && question.isDeleted.status) {
        res.status(404).json({ error: 'Question is deleted' });
        return;
      }

      console.log('Question retrieved:', question);
      res.status(200).json(question);
    } catch (error) {
      console.error('Error retrieving question:', error);
      res.status(500).json({ error: 'Error retrieving question' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
