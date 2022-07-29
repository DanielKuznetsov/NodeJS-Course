// https://www.natours.dev/api/v1/tours
const express = require('express');
const morgan = require('morgan');

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

// Handling unknown routes ––– must be at the end of all routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'failed',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// 2. ROUTES
app.use('/api/v1/tours', tourRouter); // middleware
app.use('/api/v1/users', userRouter); // this is where we mount 2 routes

module.exports = app;
