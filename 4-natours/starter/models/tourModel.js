const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

// ! THIS IS BASIC SCHEMA
const tourSchema = new mongoose.Schema(
  {
    name: {
      // describing the type of data we want to pass in
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true, // trimming white space off the string
      maxLength: [40, 'The tour must have less or equal than 40 characters'], // maximum length  of a field
      minlength: [10, 'The tour must have less or equal than 10 characters'], // minimum length of a field
      // validate: [validator.isAlpha, 'Tour name must only contain characters'], // external libarary validation
    },
    slug: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5, // will be calculated later with real reviews
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'The rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0, // will be calculated later with real reviews
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          // validating the price, value is the "priceDiscount"
          return value < this.price; // this won't work in the "PATCH"; therefore, only points to the current or NEW document creating
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
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
      // select: false, // hides form the API output
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      deault: false,
    },
    startLocation: {
      // MongoDB uses GeoJSON in order to specify geospacial data
      type: {
        type: String,
        default: 'Point', // Poligons or Lines
        enum: ['Point'],
      },
      coordinated: [Number], // expect an array of numbers
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        date: Number,
      },
    ],
    // guides: Array,
    guides: [
      { type: mongoose.Schema.ObjectId, ref: 'User' }, // expecting a MongoDB ID
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Has to scan less documents
tourSchema.index({ price: 1, ratingsAverage: -1 }); // 1/-1 is for ascending order
tourSchema.index({ 'startLocation.coordinates': '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual Populate to get tours know what reviews they have instead of creating an infinite array
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour', // reference to the erview model
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runds before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Embedding in the DB
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   this.guides = await Promise.all(guidesPromises);

//   next();
// });

// // is executed after all pre middleware functions are executed
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // will start any middleware that starts with "find" at the beginning of the query
  this.find({
    secretTour: { $ne: true },
  });

  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);

  next();
});

// Populate method for the "guides" section in the tourModel
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });

// ! THIS IS BASIC MODEL TO THE SCHEMA RIGHT ABOVE
const Tour = mongoose.model('Tour', tourSchema); // use uppercase on names and variables in mongoose models

module.exports = Tour;
