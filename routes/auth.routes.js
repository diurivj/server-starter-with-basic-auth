// routes/auth.routes.js

const router = require('express').Router();
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
    const userRegitered = await User.register({ email, name }, password);
    return res.status(201).json({ userRegitered });
  } catch (err) {
    return res.status(500).json({ err });
  }
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json({ err, info });
    if (!user) return res.status(401).json({ err: { ...info } });
    req.login(user, error => {
      if (error) return res.status(401).json({ error });
      return res.status(200).json({ user });
    });
  })(req, res, next);
});

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
