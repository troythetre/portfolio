import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

export const addUser = functions.auth.user().onCreate(async (user) => {
  const userRef = admin.firestore().collection("users").doc(user.uid);
  return await userRef.set({
    trialStart: new Date(),
    billingHistory: [],
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  });
});
