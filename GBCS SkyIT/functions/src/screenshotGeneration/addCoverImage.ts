import * as functions from "firebase-functions";
import generateCoverImage from "./generateCoverImage";

export const addCoverImage = functions.firestore
  .document("proposals/{proposalID}")
  .onCreate(
    async (change, context) =>
      await generateCoverImage(context.params.proposalID)
  );
