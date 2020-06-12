const router = require('express').Router();

/* GET home page */
router.get('/', (req, res) => res.json({ message: 'App created with Ironhack generator 🚀' }));

module.exports = router;
