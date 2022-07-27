const mongoose = require('mongoose');

// ! THIS IS BASIC SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    // describing the type of data we want to pass in
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true, // trimming white space off the string
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5, // will be calculated later with real reviews
  },
  ratingsQuantity: {
    type: Number,
    default: 0, // will be calculated later with real reviews
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, // trimming white space off the string,
    required: [true, 'A tour must have a summary'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String, // reference to the file will be stored in the database
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], // defining an array of strings
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
// ! THIS IS BASIC MODEL TO THE SCHEMA RIGHT ABOVE
const Tour = mongoose.model('Tour', tourSchema); // use uppercase on names and variables in mongoose models

module.exports = Tour;
