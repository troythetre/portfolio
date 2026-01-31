/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

//const admin = require("firebase-admin");
const functions = require('firebase-functions');
const app = require('./express-api/app'); // Import your Express app

exports.addUser = functions.auth.user().onCreate(async(user) => {
    const userRef = admin.firestore().collection("users").doc(user.uid);

    // Check if the user already exists in the users collection
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
        // If the user does not exist, add them to the collection
        return await userRef.set({
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            role: "user", // Set the role to "user" as default
        });
    } else {
        // If the user already exists, you can handle it accordingly
        return null; // Return null to indicate that no action is taken
    }
});

// functions/proposalFunction.js


exports.api = functions.https.onRequest(app);