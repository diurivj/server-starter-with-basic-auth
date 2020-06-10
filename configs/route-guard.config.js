module.exports = (req, res, next) => {
  if (req.session.currentUser) next();
  else res.status(401).json({ message: 'You have to login first!' });
};
