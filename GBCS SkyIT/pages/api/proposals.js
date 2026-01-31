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

async function createOrUpdateProposal(data) {
  try {
    const { proposalID, ...fieldsToUpdate } = data;

    // Check if the proposal already exists
    const proposalRef = db.collection('proposals').doc(proposalID);
    const proposalDoc = await proposalRef.get();

    if (!proposalDoc.exists) {
      // Create a new proposal document
      const newProposal = {
        createdAt: new Date(),
        lastModified: new Date(),
      };
      await proposalRef.set(newProposal);
    }

    // Retrieve existing proposal data
    const existingProposal = proposalDoc.data();

    // Merge existing data with fields to update
    const updatedProposal = {
      ...existingProposal,
      ...fieldsToUpdate,
      lastModified: new Date(),
    };

    // Update the proposal document
    await proposalRef.update(updatedProposal);

    // Process the questions
    if (data.questions && data.questions.length > 0) {
      const questionsCollectionRef = proposalRef.collection('questions');

      for (const questionData of data.questions) {
        const { questionID, question, answer, topic, subtopic, software } = questionData;

        // Create or update the question document in the questions collection
        const questionDocRef = questionsCollectionRef.doc(questionID);
        await questionDocRef.set({
          questionID,
          text: question,
          response: {
            answer: answer || '',
            topic: topic || 'N/A',
            subtopic: subtopic || 'N/A',
            software: software || 'N/A',
          },
        });
      }
    }

  } catch (error) {
    console.error('Error creating or updating proposal:', error);
    throw error;
  }
}

// Endpoint
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { action, proposalID, questionID, question, answer } = req.body;

      switch (action) {
        case 'create':
          await createOrUpdateProposal(req.body);
          res.status(200).json({ message: 'Proposal created successfully!' });
          break;

          case 'update':
            await createOrUpdateProposal({
              proposalID,
              ...req.body,
            });
            res.status(200).json({ message: 'Proposal updated successfully!' });
            break;

            case 'add-question':
              try {
                const { proposalID, questionID, question, answer, topic, subTopic, software } = req.body;
            
                // Retrieve the existing proposal document
                const proposalSnapshot = await db.collection('proposals').doc(proposalID).get();
            
                // Check if the proposal document exists
                if (!proposalSnapshot.exists) {
                  res.status(404).json({ message: 'Proposal not found!' });
                  return;
                }
            
                const existingProposal = proposalSnapshot.data();
            
                // Create or update questions collection
                const questionsCollectionRef = proposalSnapshot.ref.collection('questions');
            
                // Delete the responses associated with the specified question ID
                const existingQuestion = existingProposal.questions.find(q => q.questionID === questionID);
                if (existingQuestion) {
                  const responsesPath = `proposals/${proposalID}/questions/${questionID}/responses`;
                  const responsesCollectionRef = db.collection(responsesPath);
            
                  // Retrieve the existing responses
                  const existingResponsesSnapshot = await responsesCollectionRef.get();
            
                  // Delete each response document
                  existingResponsesSnapshot.forEach(async responseDoc => {
                    await responseDoc.ref.delete();
                  });
                }
            
                // Create a new question object
                const newQuestion = {
                  questionID: questionID,
                  text: question,
                  response: {
                    answer: answer || '',
                    topic: topic || 'N/A',
                    subtopic: subTopic || 'N/A',
                    software: software || 'N/A',
                  },
                };
            
                // Add the new question to the existing questions array
                existingProposal.questions.push(newQuestion);
            
                // Update the proposal document with the modified questions array
                await proposalSnapshot.ref.update({ questions: existingProposal.questions });
            
                // Create or update the question document in the questions collection
                const questionDocRef = questionsCollectionRef.doc(questionID);
                await questionDocRef.set({
                  questionID,
                  text: question,
                  response: {
                    answer: answer || '',
                    topic: topic || 'N/A',
                    subtopic: subTopic || 'N/A',
                    software: software || 'N/A',
                  },
                });
            
                res.status(200).json({ message: 'Question added successfully!' });
              } catch (error) {
                console.error('Error adding question:', error);
                res.status(500).json({ error: 'Error adding question' });
              }
              break;
            
            case 'update-question':
              try {
                const { proposalID, questionID, question } = req.body;
            
                // Retrieve the existing proposal document
                const proposalSnapshot = await db.collection('proposals').doc(proposalID).get();
            
                // Check if the proposal document exists
                if (!proposalSnapshot.exists) {
                  res.status(404).json({ message: 'Proposal not found!' });
                  return;
                }
            
                const existingProposal = proposalSnapshot.data();
            
                // Update the question in the proposal
                const updatedQuestions = existingProposal.questions.map((q) => {
                  if (q.questionID === questionID) {
                    return {
                      ...q,
                      question: question || q.question,
                    };
                  }
                  return q;
                });
            
                // Update the proposal document with the modified questions array
                await proposalSnapshot.ref.update({ questions: updatedQuestions });
            
                // Update the question document in the questions collection
                const questionDocRef = proposalSnapshot.ref.collection('questions').doc(questionID);
                await questionDocRef.update({ text: question });
            
                res.status(200).json({ message: 'Question updated successfully!' });
              } catch (error) {
                console.error('Error updating question:', error);
                res.status(500).json({ error: 'Error updating question' });
              }
              break;

          case 'update-answer':
            try {
              const { proposalID, questionID, answer, topic, subTopic, software } = req.body;
          
              // Retrieve the existing proposal document
              const proposalRef = db.collection('proposals').doc(proposalID);
              const proposalDoc = await proposalRef.get();
          
              if (proposalDoc.exists) {
                const existingProposal = proposalDoc.data();
          
                // Update the answer field in the proposal
                const updatedQuestions = existingProposal.questions.map((q) => {
                  if (q.questionID === questionID) {
                    return {
                      ...q,
                      answer: answer || q.answer,
                    };
                  }
                  return q;
                });
          
                // Update the proposal document with the modified questions array
                await proposalRef.update({ questions: updatedQuestions });
          
                // Retrieve the existing question document
                const questionRef = proposalRef.collection('questions').doc(questionID);
                const questionDoc = await questionRef.get();
          
                if (questionDoc.exists) {
                  const existingQuestion = questionDoc.data();
          
                  // Update the response fields in the question document
                  const updatedResponse = {
                    answer: answer || existingQuestion.response.answer || '',
                    topic: topic || existingQuestion.response.topic || 'N/A',
                    subtopic: subTopic || existingQuestion.response.subtopic || 'N/A',
                    software: software || existingQuestion.response.software || 'N/A',
                  };
          
                  // Update the response field of the question document
                  await questionRef.update({ response: updatedResponse });
          
                  res.status(200).json({ message: 'Answer updated successfully!' });
                } else {
                  res.status(404).json({ error: 'Question not found' });
                }
              } else {
                res.status(404).json({ error: 'Proposal not found' });
              }
            } catch (error) {
              console.error('Error updating answer:', error);
              res.status(500).json({ error: 'Error updating answer' });
            }
            break;

        case 'delete-proposal':
          // Delete the entire proposal and its questions/responses
          const proposalRef = db.collection('proposals').doc(proposalID);
          const proposalDoc = await proposalRef.get();

          if (proposalDoc.exists) {
            const batch = db.batch();

            // Delete all questions and their associated responses
            const questionsSnapshot = await proposalRef.collection('questions').get();
            for (const questionDoc of questionsSnapshot.docs) {
              const questionRef = questionDoc.ref;

              // Delete all responses associated with the question
              const responsesSnapshot = await questionRef.collection('responses').get();
              for (const responseDoc of responsesSnapshot.docs) {
                batch.delete(responseDoc.ref);
              }

              // Delete the question document
              batch.delete(questionRef);
            }

            // Commit the batch write operation to delete questions and responses
            await batch.commit();

            // Delete the proposal document
            await proposalRef.delete();

            res.status(200).json({ message: 'Proposal and its questions/responses deleted successfully!' });
          } else {
            res.status(404).json({ error: 'Proposal not found' });
          }
          break;

        case 'delete-question':
          if (questionID) {
            const proposalRef = db.collection('proposals').doc(proposalID);
            const proposalDoc = await proposalRef.get();

            if (proposalDoc.exists) {
              const batch = db.batch();

              // Delete the question document
              const questionRef = proposalRef.collection('questions').doc(questionID);
              const questionDoc = await questionRef.get();

              if (questionDoc.exists) {
                batch.delete(questionRef);

                // Remove the question from the 'questions' array in the proposal document
                const questionsArray = proposalDoc.data().questions || [];
                const updatedQuestions = questionsArray.filter((question) => question.questionID !== questionID);

                batch.update(proposalRef, { questions: updatedQuestions });

                // Delete all responses associated with the question
                const responsesSnapshot = await questionRef.collection('responses').get();
                responsesSnapshot.forEach((responseDoc) => {
                  batch.delete(responseDoc.ref);
                });

                // Commit the batch write operation
                await batch.commit();

                res.status(200).json({ message: 'Question and its responses deleted successfully!' });
              } else {
                res.status(404).json({ error: 'Question not found' });
              }
            } else {
              res.status(404).json({ error: 'Proposal not found' });
            }
          } else {
            res.status(400).json({ error: 'Invalid question ID' });
          }
          break;

        default:
          res.status(400).json({ error: 'Invalid action' });
          break;
      }
    } catch (error) {
      console.error('Error performing action:', error);
      res.status(500).json({ error: 'Error performing action' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
