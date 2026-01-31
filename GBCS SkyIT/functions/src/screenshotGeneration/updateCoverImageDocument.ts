import * as functions from "firebase-functions";
import generateCoverImage from "./generateCoverImage";

export const updateCoverImageDocument = functions.firestore
  .document("proposals/{proposalID}")
  .onUpdate(async (change, context) => {
    const beforeData = change.before.data();
    const afterData = change.after.data();
    if (
      beforeData.globalColor !== afterData.globalColor ||
      beforeData.userLogoURL !== afterData.userLogoURL ||
      beforeData.clientLogoURL !== afterData.clientLogoURL
    ) {
      return await generateCoverImage(context.params.proposalID);
    } else return null;
  });
