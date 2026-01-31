const admin = require("firebase-admin");
const express = require('express');
// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const serviceAccount = require('./voop-68258-firebase-adminsdk-vuc6t-d18f209c9c.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

// Get a reference to the Firestore database
exports.db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

// Helper function to verify the Firebase ID token
// export async function verifyToken(token) {
//     try {
//         await admin.auth().verifyIdToken(token);
//         return true;
//     } catch (error) {
//         console.error("Error verifying token:", error);
//         return false;
//     }
// }

// export async function decodeToken(token) {
//     try {
//         const decodedToken = await admin.auth().verifyIdToken(token);
//         return decodedToken;
//     } catch (error) {
//         console.error("Error verifying token:", error);
//         return null; // Return null or false in case of an error
//     }
// }

//exports.module = { FieldValue };