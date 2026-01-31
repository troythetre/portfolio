import * as functions from "firebase-functions";
import generateCoverImage from "./generateCoverImage";

export const updateCoverImageFirstPage = functions.firestore
  .document("proposals/{proposalID}/pages/{pageID}")
  .onUpdate(async (change, context) => {
    if (change.after.data().index !== 0) {
      return;
    }
    return await generateCoverImage(context.params.proposalID);
  });
