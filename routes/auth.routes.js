// routes/auth.routes.js

const router = require('express').Router();
const User = require('../models/User.model');
const passport = require('passport');
const { signToken, verifyToken } = require('../configs/jwt');

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
    userRegitered.salt = undefined;
    userRegitered.hash = undefined;
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
    const token = signToken(user);
    user.salt = undefined;
    user.hash = undefined;
    return res.status(200).json({ user, token }); // You should store the token in your front end app, (e.g context, local storage, state)
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

router.get('/api/isLoggedIn', verifyToken, (req, res) => {
  User.findById(req.token.sub)
    .then(user => {
      user.salt = undefined;
      user.hash = undefined;
      return res.status(200).json({ user });
    })
    .catch(err => {
      return res.status(501).json({ err });
    });
});

module.exports = router;
