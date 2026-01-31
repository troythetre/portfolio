import { db, decodeToken } from './firebase'; // Import your Firebase and decode token functions

async function moveResponseToTrash(responseID, userEmail, reason) {
  try {
    const responseRef = db.collection('responses').doc(responseID);

    // Check if the proposal exists
    const responseSnapshot = await responseRef.get();
    if (!responseSnapshot.exists) {
      return 'Response not found';
    }

    // Update response to mark it as deleted and set deletedBy field
    await responseRef.update({
      'isDeleted.status': true,
      'isDeleted.deletionDate': new Date(),
      'isDeleted.deletedBy': userEmail,
    });

    // Create a new document in the trash collection with an auto-generated reference
    const trashReason = reason ? reason : 'No reason left';
    const trashDocRef = await db.collection('trash').add({
      itemType: 'response',
      reasonForDeletion: trashReason,
      restorationInfo: { responseID },
      deletedAt: new Date(),
      deletedBy: userEmail, // Add the deletedBy field with user's email
    });

    return { message: 'Response moved to trash!', trashRef: trashDocRef.id };
  } catch (error) {
    console.error('Error moving proposal to trash:', error);
    throw error;
  }
}

export default async function handler(req, res) {
  if (req.method === 'DELETE') {
    try {
      const bearerToken = req.headers.authorization?.split(' ')[1];

      if (!bearerToken) {
        res.status(401).json({ error: 'Missing authentication token' });
        return;
      }

      //verify firebase id token
      const decodedToken = await decodeToken(bearerToken);

      if (!decodedToken || !decodedToken.email) {
        res.status(401).json({ error: 'Invalid authentication token' });
        return;
      }

      const findUser = await db
        .collection('users')
        .where('email', '==', decodedToken.email)
        .get();

      if (!findUser.empty) {
        // Assuming email is unique, get the user data
        const userRecord = findUser.docs[0].data();

        //check if the user is an admin
        if (userRecord.hasOwnProperty('role') && userRecord.role === 'admin') {
          const userEmail = decodedToken.email;

          const { responseID, reason } = req.body;

          const responseRef = db.collection('responses').doc(responseID);
          const responseSnapshot = await responseRef.get();

          if (!responseSnapshot.exists) {
            res.status(404).json({ error: 'Response not found' });
            return;
          }

          const isDeleted = responseSnapshot.data().isDeleted;

          if (isDeleted && isDeleted.status) {
            res.status(400).json({ message: 'response is in trash' });
            return;
          }

          const moveResult = await moveResponseToTrash(
            responseID,
            userEmail,
            reason
          );
          res.status(200).json(moveResult);
        } else {
          res.status(405).json({ error: 'User isnt an admin ' });
          return;
        }
      } else {
        res.status(405).json({ error: "couldn't find user" });
      }
    } catch (error) {
      console.error('Error handling delete request:', error);
      res.status(500).json({ error: 'Error processing delete request' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
