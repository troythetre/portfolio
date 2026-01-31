import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { csv2jsonAsync } from "json-2-csv";

export const importResponseCSV = functions.https.onCall(
  async (data, context) => {
    const cleanedText = data.csvText.replace(/\r\n/g, "\n");
    const json = await csv2jsonAsync(cleanedText);
    const batch = admin.firestore().batch();
    json.forEach((row) => {
      const docRef = admin.firestore().collection("responses").doc();
      batch.set(docRef, {
        ...row,
        owner: context?.auth?.uid,
      });
    });
    return batch.commit();
  }
);
