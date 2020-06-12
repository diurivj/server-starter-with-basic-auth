const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');

// Local Strategy Config
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email', // we use the email field from the User model to register and authenticate users.
      passwordField: 'password'
    },
    (email, password, done) => {
      User.findOne({ email })
        .then(foundUser => {
          if (!foundUser) {
            done(null, false, { message: 'Incorrect email' });
            return;
          }

          if (!bcrypt.compareSync(password, foundUser.passwordHash)) {
            done(null, false, { message: 'Incorrect password' });
            return;
          }

          done(null, foundUser);
        })
        .catch(err => done(err));
    }
  )
);

// Serialize and deserialize User
// For more info, this answer from stack overflow is amazing: https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
passport.serializeUser((loggedInUser, cb) => {
  cb(null, loggedInUser._id);
});

passport.deserializeUser((userIdFromSession, cb) => {
  User.findById(userIdFromSession)
    .then(userDocument => {
      cb(null, userDocument);
    })
    .catch(err => {
      cb(err);
    });
});

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
