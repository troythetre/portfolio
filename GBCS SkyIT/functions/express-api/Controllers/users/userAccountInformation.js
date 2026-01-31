const express = require('express');
const bcrypt = require('bcrypt');
const { auth } = require('../../firebase');
const { db } = require('../../firebase');
const passport = require('passport');
const mongoose = require('mongoose');
const Account = require('./models/account');
const userAccountInformationRouter = express.Router();

      const Article = mongoose.model('Article', {
        title: String,
        content: String,
        category: String,
        created_at: { type: Date, default: Date.now },
      });

// Account information for Admin
userAccountInformationRouter.get( '/account/admin', async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      res.status(200).send('You are Successfully Authenticated.');
    } else {
      res.status(401).json({ error: 'Not authorized: Only Admins can perform this action' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unauthorized' });
  }
});

// Route for updating user security settings
userAccountInformationRouter.put('/account/security', async (req, res) => {
  try {
    // Check authentication before proceeding
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Retrieve users' email and role info from the database
    const usersSnapshot = await db.collection('users').get();
    const Users = [];

    // Set to store unique users
    const uniqueUsers = new Set();

    // Add the user to the Set to track uniqueness
    usersSnapshot.forEach((doc) => {
      const userData = doc.data();
      const user = userData.email;
      const role = userData.role; // Assuming the role field is present in the user's data

      if (user && !uniqueUsers.has(user)) {
        Users.push({ email: user, role: role });
        uniqueUsers.add(user);
      }
    });

    res.status(200).json({ Users });
    // Redirect the user to a success page or send a success response
    res.send('Security settings updated successfully');
  } catch (error) {
    // Handle error
    res.status(500).send('Failed to update security settings');
  }
});

// Route for team management
userAccountInformationRouter.post('/team',  async (req, res) => {
  // Logic to create a new team
  try {
    const existingUser = await auth.getUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user in Firebase Authentication
    const userRecord = await auth.createUser({
      email,
      password: hashedPassword,
      displayName: `${firstName} ${lastName}`,
    });

    // Create a corresponding document in Firestore (assuming you're using Firestore)
    await db.collection('users').doc(userRecord.uid).set({
      firstName,
      lastName,
      email,
      role: 'team_member', 
    });

    res.status(200).json({ message: 'Team created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Account information route User
userAccountInformationRouter.get('/user', async(req, res) => {

  const username = req.params.username;
  try{
  const account = await Account.findOne({ username });
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  return res.json(account);
} catch (error) {
  console.error(error);
  return res.status(500).json({ error: 'Internal Server Error' });
}
});

// Logout route
userAccountInformationRouter.get('/logout', (req, res) => {
    if (req.session) {
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
  } else {
      const err = new Error('You are not logged in!');
      err.status = 401;
      return next(err);
    }
    const err = new Error('You are not logged in!');
    err.status = 401;
    return next(err); 
  })

// Help center route
userAccountInformationRouter.get('/help', (req, res) => {
  try {
    const articles = Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = userAccountInformationRouter;