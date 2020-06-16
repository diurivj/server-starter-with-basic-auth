// routes/auth.routes.js

const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');
const mongoose = require('mongoose');

const routeGuard = require('../configs/route-guard.config');

////////////////////////////////////////////////////////////////////////
///////////////////////////// SIGNUP //////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .post() route ==> to process form data
router.post('/signup', (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(401).json({ message: 'All fields are mandatory. Please provide your username, email and password.' });
    return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).json({ message: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }

  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
      return User.create({
        // username: username
        username,
        email,
        // passwordHash => this is the key from the User model
        //     ^
        //     |            |--> this is placeholder (how we named returning value from the previous method (.hash()))
        passwordHash: hashedPassword
      });
    })
    .then(userFromDB => {
      userFromDB.passwordHash = undefined;
      res.status(200).json({ userFromDB });
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).json({ message: error.message });
      } else if (error.code === 11000) {
        res.status(500).json({
          message: 'Username and email need to be unique. Either username or email is already used.'
        });
      } else {
        next(error);
      }
    }); // close .catch()
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGIN ////////////////////////////////////
////////////////////////////////////////////////////////////////////////

// .post() login route ==> to process form data
router.post('/login', (req, res, next) => {
  const { email, password } = req.body;

  if (email === '' || password === '') {
    res.status(401).json({ message: 'Please enter both, email and password to login.' });
    return;
  }

  User.findOne({ email })
    .then(user => {
      if (!user) {
        res.status(401).json({ message: 'Email is not registered. Try with other email.' });
        return;
      } else if (bcryptjs.compareSync(password, user.passwordHash)) {
        req.session.currentUser = user;
        user.passwordHash = undefined;
        res.status(200).json({ user });
      } else {
        res.status(401).json({ message: 'Incorrect password.' });
      }
    })
    .catch(error => next(error));
});

////////////////////////////////////////////////////////////////////////
///////////////////////////// LOGOUT ///////////////////////////////////
////////////////////////////////////////////////////////////////////////

router.post('/logout', (req, res) => {
  req.session.destroy();
  res.status(200).json({ message: 'Successfully logged out!' });
});

////////////////////////////////////////////////////////////////////////
///////////////////// CHECK IF LOGGED IN ///////////////////////////////
////////////////////////////////////////////////////////////////////////

router.get('/isLoggedIn', (req, res) => {
  if (req.session.currentUser) {
    req.session.currentUser.passwordHash = undefined;
    res.status(200).json({ user: req.session.currentUser });
    return;
  }
  res.status(401).json({ message: 'Unauthorized access!' });
});

module.exports = router;
