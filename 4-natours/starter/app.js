// https://www.natours.dev/api/v1/tours
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

// ! Setting up "Pug"
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views')); // joining directory name /views

// Security HTTP headers
app.use(helmet());

// 1. GLOBAL MIDDLEWARES - middleware - function that modifies the incoming information
app.use(express.json({ limit: '10kb' })); // Body parser, reading data from the body into req.body; body larger 10kb won't be accepted

// Data sanitization against NoSQL query injection
// ! {
// !   "email": { "$gt": "" },
// !   "password": "newpass1234"
// ! }
app.use(mongoSanitize()); // filters out operators and $-dollar sign from queries

// Data sanitization against XSS
app.use(xss()); // clean input from malisious html code

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Limit requests from same IP
const limiter = rateLimit({
  max: 100, // will allow 100 requests from the same IP in 1 HOUR
  windowMs: 60 * 60 * 1000, // resets in 1 hour
  message: 'Too many requests from this IP. Please try again in an hour!',
});
app.use('/api', limiter); // will affect only routes that start with /api

// Serving static files
app.use(express.static(`${__dirname}/public`)); // ! need for CSS to work

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 2. ROUTES
// Rendering "pug" file
app.get('/', (req, res) => {
  res.status(200).render('base', {
    tour: 'The Forest Hiker', // ! this is a variable in pug file
    user: 'Daniel K',
  });
});

app.get('/overview', (req, res) => {
  res.status(200).render('overview', {
    title: 'All Tours',
  });
});

app.get('/tour', (req, res) => {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
});

app.use('/api/v1/tours', tourRouter); // middleware
app.use('/api/v1/users', userRouter); // this is where we mount 2 routes
app.use('/api/v1/reviews', reviewRouter);

// Handling unknown routes ––– must be at the end of all routes
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'failed',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404)); // will skip all other middlewares in the stack and go straight to the next one down below
});

// Middleware error handling
app.use(globalErrorHandler);

module.exports = app;
