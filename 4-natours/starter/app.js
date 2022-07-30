// https://www.natours.dev/api/v1/tours
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utilities/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// 1. MIDDLEWARES - middleware - function that modifies the incoming information
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serving static files
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2. ROUTES
app.use('/api/v1/tours', tourRouter); // middleware
app.use('/api/v1/users', userRouter); // this is where we mount 2 routes

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
