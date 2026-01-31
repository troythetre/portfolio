import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as puppeteer from "puppeteer";

export const saveQuotePDF = functions
  .region("us-central1")
  .https.onCall(async (data, context) => {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.goto(`http://localhost:3000/price-quotes/${data.id}/raw`, {
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
    const file = bucket.file(
      `${data.uid}/priceQuotes/${data.id}/${data.name}.pdf`
    );
    await file.save(pdf, {
      contentType: "application/pdf",
    });
    return {
      url: `https://storage.googleapis.com/voop-68258.appspot.com/${data.uid}/priceQuotes/${data.id}/${data.name}.pdf`,
    };
  });
