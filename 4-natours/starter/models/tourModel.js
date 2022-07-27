const mongoose = require('mongoose');

// ! THIS IS BASIC SCHEMA
const tourSchema = new mongoose.Schema({
  name: {
    // describing the type of data we want to pass in
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
// ! THIS IS BASIC MODEL TO THE SCHEMA RIGHT ABOVE
const Tour = mongoose.model('Tour', tourSchema); // use uppercase on names and variables in mongoose models

module.exports = Tour;
