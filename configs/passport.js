const passport = require('passport');
const User = require('../models/User.model');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = app => {
  app.use(passport.initialize());
  app.use(passport.session());
};
