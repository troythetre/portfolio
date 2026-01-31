const express = require('express');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCn424vvn2vs0su\n2UKyzGzdHtcYJlI9J2qPLujqdN1RdTf2U5f8UTsZEr3wYUun+JQ9/ADEAV9sHbKk\nVxrUZz3TfKctqXKvJaAxkQ6t1Fuq1aVaR6gzsF7gmVFBTxFJRmgKNgspD3uJD29Y\nynX0Rjk/U+0pUDh+b+9jK7MMDb3BWfL7QqlWNLVHL14adokBg+4nmIvP16izmWjI\np1K8Is/pkqt9b2jmmL6Ca2pZ5x6CnClMTNAMR/lxa4byn6MMvtSau0QCVNfgGy+4\nO6LUf6SWq+hl4waZ4eNTr4f4WZuw+t33A816cmXz2YEo0ms8T3RV/dc68dVxDULb\nLlKpVjV3AgMBAAECggEAL2YDuUIADQdC/h6DeKRDRehLlLtY83/50yPMyUimJTXB\nT2+JVMiANVN3wXJOoEULYTaQ5sV2cbkusrwOzJG7QEaMklUpFi66u9O2v7fZC3GW\n5daeM72jA6j1aklO2Y+hluRsITMITwlHB9vdElJzHiBtMAFAed3TSX3QZmJIxNnQ\ntkjDw1DaKRuTzG/1KEDBZDTxFTdxA6K1TcKFilI7kwVfj3m61Q4AtH7eHPEaNM6A\nxPHrtNfsTD7+aAwtUaixrNWXMwSoo+l37ZLrtE9TtrIfB+iLpQQ1EIS7tbjbbJBN\n7q5OhDmATKKFlmmgOfU72BnWD+JpNb2O0DHY2YwQrQKBgQDsB0NySLzbMrH3xr1/\nEECokl5+xFIRJ7tiNK2ZQjGB+TH/4AG745mja+pI8i7kQ583Q9596ITH29WL+KMl\nqFYL9ly5S4ZuGPUv5o6NdZRiYwUd4fTb3gIS5Y9gVw0Vrsl8ZhyMQby5jK6G8u+c\nVamsH8MoKnzQMBiTeUdaad7UIwKBgQC2GCaQWxKQ5S5upjBE3Cg/h7tpys+I/Wb0\nRgMg+n0h1xmbkwGEC9/jZe3E3azaMOvA0bF296bQbQICbvtplpskXgJ9nekSqmqi\ng/8EJ9gvdevSj4DJNAqtSKBCRZfbuTZAXehWkeq01Yo1EAxuigl+ZG6UjvWxl6tF\nTG76Bv00nQKBgBHsp0mZjoYS/oLzm9Z3dIGYxAZagGT/IHLfz0MxTLMzKoHlEByl\ntzg67MrnYXpCTGgVBmOHcfX/kuMTWch1VTuJVRdZTfc0fAJMPw0tHbyvCmdvjnnY\nDU5EErRdSAgagwCofIiGQX/R2Ds1Xc8Ajmcc7mQxfdMNpAAnGK0cFykDAoGBAJkp\nbyZ0tAUUAB4pwufoliH5tPWjFTUQj4xfZzpR9vaDypJE8D11D3hhv8CbBEzyYRnq\nRu7eF32wcsRBPU7u0segG1A1hlmg5diUVefU683fzd9pvNV/5IskT0fu6XBzNOKn\nGknWqig4hOtk+E/x41Jgf3KNXLNn8zNyutWrE0cxAoGAF9+KjVGl960Ex6hZwT9Y\nd3ViTeyQ64JGRHiS37duRvKaO7zdSNBfdJRNTWSmokWCZOOC9d1JpAfwtAHsLPle\nTQuHyamE4GbJsEfSLalRM0jZtFonQk2qAJ7rY42083wMTyxeLSHflwnF9tThYxCx\nyfl41faZkZ0s5JHfy1ElHvM=\n'); //  service account key
const Firepad = require('firepad');

const proposalCollaborationRouter = express.Router();

// Initialize Firebase Admin
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://voop-68258-default-rtdb.firebaseio.com", //  Firebase project URL
});

// Middleware to verify Firebase ID token
const authenticate = async (req, res, next) => {
  try {
    const idToken = req.header('Authorization').split('Bearer ')[1];
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Real-time collaboration route
proposalCollaborationRouter.post('/collaborate/:proposalId/:sectionId', authenticate, (req, res) => {
  const { proposalId, sectionId } = req.params;
  const { user } = req;

  // Firebase Realtime Database reference
  const database = firebaseAdmin.database();
  const documentRef = database.ref(`collaboration/${proposalId}/${sectionId}`);

  // Firepad initialization
  const firepad = Firepad.from(database, documentRef, {
    userId: user.uid,
    richTextToolbar: true,
    richTextShortcuts: true,
  });

  // Send Firepad instance ID to the client
  res.json({ firepadInstanceId: firepad.id });
});

module.exports = proposalCollaborationRouter;