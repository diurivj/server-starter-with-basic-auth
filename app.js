require('dotenv').config();

const path = require('path'); // here
const express = require('express'); // here
const logger = require('morgan'); // here
const cors = require('cors');

const cookieParser = require('cookie-parser'); // here

// Set up the database
require('./configs/db.config');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // here

// Cross-Origin Resource Sharing
app.use(
  cors({
    origin: [process.env.FRONTEND_POINT],
    credentials: true // this needs set up on the frontend side as well
    //                   in axios "withCredentials: true"
  })
);

// Express session
require('./configs/session.config')(app);

// Passport
require('./configs/passport')(app);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Routes middleware
app.use('/', require('./routes/index.routes'));
app.use('/', require('./routes/auth.routes'));

// Catch missing routes and forward to error handler
app.use((req, res) => {
  return res.status(400).json({ type: 'not-found', error: { message: "This route doesn't exists" } });
});

// Catch all error handler
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({ type: 'error', error: { message: error.message } });
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Running on http://localhost:${3001}`);
});
