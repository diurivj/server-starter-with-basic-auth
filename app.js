require('dotenv').config();

const path = require('path'); // here
const express = require('express'); // here
const createError = require('http-errors');
const logger = require('morgan'); // here
const favicon = require('serve-favicon'); // here
const cors = require('cors');

const cookieParser = require('cookie-parser'); // here
const mongoose = require('mongoose'); // here

// Set up the database
require('./configs/db.config');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
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

require('./configs/session.config')(app);

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Routes middleware
app.use('/', require('./routes/index.routes'));
app.use('/api', require('./routes/auth.routes'));

// Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch all error handler
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({ type: 'error', error: { message: error.message } });
});

module.exports = app;
