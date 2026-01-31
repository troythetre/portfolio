import * as admin from "firebase-admin";
import { addUser } from "./auth/addUser";

import { importResponseCSV } from "./csvHandling/importResponseCSV";
import { exportQuoteExcel } from "./csvHandling/exportQuoteExcel";

import { saveProposalPDF } from "./pdfGeneration/saveProposalPDF";
import { saveQuotePDF } from "./pdfGeneration/saveQuotePDF";

import { addCoverImage } from "./screenshotGeneration/addCoverImage";
import { updateCoverImageDocument } from "./screenshotGeneration/updateCoverImageDocument";
import { updateCoverImageFirstPage } from "./screenshotGeneration/updateCoverImageFirstPage";

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: "voop-68258.appspot.com",
});

export {
  saveQuotePDF,
  saveProposalPDF,
  addUser,
  addCoverImage,
  updateCoverImageDocument,
  updateCoverImageFirstPage,
  importResponseCSV,
  exportQuoteExcel,
};
