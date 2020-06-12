// routes/auth.routes.js

const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const passport = require('passport');

////////////////////////////////////////////////////////////////////////
///////////////////////////// SIGNUP //////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(401).json({ message: 'All fields are mandatory. Please provide your name, email and password.' });
  }

  // Check if is a user is already registered
  try {
    const user = await User.findOne({ email });
    if (user) return res.status(500).json({ message: 'User already exists' });
  } catch (err) {
    return res.status(500).json({ message: err });
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    return res.status(500).json({ message: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
  }

  const salt = bcryptjs.genSaltSync(saltRounds);
  const passwordHash = bcryptjs.hashSync(password, salt);

  try {
    const userRegistered = await User.create({ name, email, passwordHash });
    userRegistered.passwordHash = undefined;
    return res.status(201).json({ userRegistered });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post(
  '/api/login',
  passport.authenticate('local', {
    passReqToCallback: true
  }),
  (req, res) => {
    const { user } = req;
    user.passwordHash = undefined;
    return res.status(200).json({ user });
  }
);

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGOUT ///////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post('/api/logout', (req, res) => {
  req.logout();
  res.status(200).json({ message: 'Logged out' });
});

////////////////////////////////////////////////////////////////////////
///////////////////// CHECK IF LOGGED IN ///////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/api/isLoggedIn', (req, res) => {
  if (req.isAuthenticated()) {
    const { user } = req;
    user.passwordHash = undefined;
    return res.status(200).json({ user });
  } else {
    return res.status(401).json({ message: 'Unauthorized access!' });
  }
});

module.exports = router;
