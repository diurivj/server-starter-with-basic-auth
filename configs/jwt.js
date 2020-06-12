const jwt = require('jsonwebtoken');

exports.signToken = user =>
  jwt.sign(
    {
      sub: user._id,
      name: user.name,
      email: user.email
    },
    process.env.SESS_SECRET,
    {
      //  A numeric value is interpreted as a seconds count.
      // If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default
      expiresIn: 1000 * 60 * 5 // -> 5 minutes
      // "2 days", -> 2 days
      // "10h", -> 10 hours
      // "7d" -> 7 days
    }
  );

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized, token not provided' });
  jwt.verify(token, process.env.SESS_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ err });
    req.token = decoded;
    next();
  });
};
