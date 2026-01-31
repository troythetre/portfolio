
const express = require('express');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');


const proposalRouter = express.Router();

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(__dirname,'/users/albertmatara/Downloads/voop-407700-d7a08525756f.json'), //path to your JSON key file
  projectId: 'voop-407700', // Replace with your GCP project ID
});

const upload = multer({
  storage: multer.memoryStorage(),
});

// Endpoint for uploading documents
proposalRouter.post('/upload', upload.single('document'), async (req, res) => {
    console.log(req.body);  // Logs the entire request body
    console.log(req.file);  // Logs the uploaded file
  
  try {
    const bucketName = 'voop_2023'; // Replace with your GCS bucket name
    const bucket = storage.bucket(bucketName);

    // Extract file information from the request
    const file = req.file;
    const fileName = Date.now() + '-' + file.originalname;

    // Upload the file to GCS
    const blob = bucket.file(fileName);
    const stream = blob.createWriteStream();
    stream.end(file.buffer);

    // Get the public URL of the uploaded file
    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

    res.json({ fileUrl: publicUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = proposalRouter;