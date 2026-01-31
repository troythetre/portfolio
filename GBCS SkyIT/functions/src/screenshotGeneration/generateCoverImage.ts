import * as admin from "firebase-admin";
import * as puppeteer from "puppeteer";

export default async function generateCoverImage(proposalID: string) {
  const proposalRef = admin.firestore().collection("proposals").doc(proposalID);
  const proposal = await proposalRef.get();
  const ownerUid = proposal
    .data()
    ?.sharedWith.find(({ role }: { role: string }) => role === "owner").uid;

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(`http://localhost:3000/proposals/${proposalID}/raw`, {
    waitUntil: "networkidle2",
  });
  const screenshot = await page.screenshot({
    path: `/tmp/${proposalID}.png`,
    clip: {
      x: 0,
      y: 0,
      width: 816,
      height: 1056,
    },
    type: "png",
  });
  await browser.close();

  const storage = admin.storage();
  const bucket = storage.bucket();
  const file = bucket.file(`${ownerUid}/proposals/${proposalID}/cover`);
  return await file.save(screenshot);
}
