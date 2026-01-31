import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as puppeteer from "puppeteer";

export const saveProposalPDF = functions.https.onCall(async (data, context) => {
  const proposalRef = admin.firestore().collection("proposals").doc(data.id);
  const proposal = await proposalRef.get();
  const ownerUid = proposal
    .data()
    ?.sharedWith.find(({ role }: { role: string }) => role === "owner").uid;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(`http://localhost:3000/proposals/${data.id}/raw`, {
    waitUntil: "networkidle2",
  });

  const pdf = await page.pdf({
    format: "letter",
    printBackground: true,
    margin: {
      top: "0cm",
      right: "0cm",
      bottom: "0cm",
      left: "0cm",
    },
  });
  await browser.close();
  const storage = admin.storage();
  const bucket = storage.bucket();
  const file = bucket.file(`${ownerUid}/proposals/${data.id}/${data.name}.pdf`);
  await file.save(pdf, {
    contentType: "application/pdf",
  });
  return {
    url: `https://storage.googleapis.com/voop-68258.appspot.com/${ownerUid}/proposals/${data.id}/${data.name}.pdf`,
  };
});
