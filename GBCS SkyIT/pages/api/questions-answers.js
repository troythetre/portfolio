import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require('./voop-68258-firebase-adminsdk-vuc6t-d18f209c9c.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Get a reference to the Firestore database
const db = admin.firestore();

async function getQuestionsAndAnswers() {
  try {
    const questionsAnswers = [];

    const manualUploadsSnapshot = await db.collection('responses').get();
    manualUploadsSnapshot.forEach((uploadDoc) => {
      const uploadData = uploadDoc.data();

      if (uploadData.Question) {
        const questionEntry = {
          question: uploadData.Question,
          answer: {
            answer: uploadData.Answer || '',
            topic: uploadData.Topic || 'N/A',
            subtopic: uploadData['Sub-Topic'] || 'N/A',
            software: uploadData.Software || 'N/A',
          },
        };

        questionsAnswers.push(questionEntry);
      }
    });

    const uniqueQuestionsAnswers = removeDuplicates(questionsAnswers, 'question');
    return { questions_answers: uniqueQuestionsAnswers };
  } catch (error) {
    console.error('Error retrieving questions and answers:', error);
    throw error;
  }
}

// Helper function to remove duplicates from an array based on a specific property
function removeDuplicates(array, property) {
  return array.filter((obj, index, self) =>
    index === self.findIndex((el) => el[property] === obj[property])
  );
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching questions and answers...');
      const questionsAnswers = await getQuestionsAndAnswers();
      console.log('Questions and answers retrieved:', questionsAnswers);
      res.status(200).json(questionsAnswers);
    } catch (error) {
      console.error('Error retrieving questions and answers:', error);
      res.status(500).json({ error: 'Error retrieving questions and answers' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
