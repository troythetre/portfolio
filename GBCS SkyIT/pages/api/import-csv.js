import admin from 'firebase-admin';
import csv from 'csv-parser';
import { isEqual } from 'lodash';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccount = require('./voop-68258-firebase-adminsdk-vuc6t-d18f209c9c.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Get a reference to the Firestore database
const db = admin.firestore();

// Function to create a document in Firestore
async function createDocument(collection, data) {
    try {
      const querySnapshot = await db.collection(collection).get();
  
      for (const doc of querySnapshot.docs) {
        if (isEqual(doc.data(), data)) {
          console.log('Skipping duplicate document:', data);
          return; // Skip creating the document
        }
      }
  
      await db.collection(collection).add(data);
      console.log('Document created successfully!');
    } catch (error) {
      console.error('Error creating document:', error);
    }
  }

const parseCSVData = (data) => {
    const results = [];
    return new Promise((resolve, reject) => {
      const csvStream = csv({
        mapHeaders: ({ header }) => header.trim(),
        mapValues: ({ value }) => value.trim(),
      });
  
      csvStream
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
        .on('error', (error) => reject(error));
  
      csvStream.write(data);
      csvStream.end();
    });
  };

// Endpoint for parsing CSV data and writing to Firestore
export default async function handleUpload(req, res) {
  console.log(req.body); // Debug statement

  const { csvData } = req.body;

  if (!csvData) {
    console.error('No CSV data provided');
    return res.status(400).json({ error: 'No CSV data provided' });
  }

  // Call the parseCSVData function to parse the CSV data
  parseCSVData(csvData)
    .then((data) => {
      // Create a document in Firestore for each row in the CSV data
      const promises = data.map((row) => createDocument('responses', row));

      Promise.all(promises)
        .then(() => {
          res.status(200).json({ message: 'CSV data imported successfully' });
        })
        .catch((error) => {
          console.error('Error importing CSV data:', error);
          res.status(500).json({ error: 'Failed to import CSV data' });
        });
    })
    .catch((error) => {
      console.error('Error parsing CSV data:', error);
      res.status(500).json({ error: 'Failed to parse CSV data' });
    });
}