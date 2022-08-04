// const fs = require('fs');
const Tour = require(`.././models/tourModel`);
// const APIfeatures = require(`../utilities/apiFeatures.js`);
const AppError = require(`../utilities/appError.js`);
const catchAsync = require('./../utilities/catchAsync');
const factory = require('../controllers/handlerFactory');

// All of this data is coming from an JSON file that should come from a database
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';

  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

exports.getTourStats = catchAsync(async (req, res, next) => {
  // passing an array of stages - aggregation pipeline
  const stats = await Tour.aggregate([
    {
      // match stage
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: `$difficulty`, // or "null"
        numTours: { $sum: 1 }, // it will go through every single tours like a loop
        numRatings: { $sum: `$ratingsQuantity` },
        avgRating: { $avg: `$ratingsAverage` },
        avgPrice: { $avg: `$price` },
        minPrice: { $min: `$price` },
        maxPrice: { $max: `$price` },
      },
    },
    {
      $sort: { avgPrice: 1 }, // assending order of sorting by "avgPrice"
    },
    // {
    //   $match: {
    //     _id: { $ne: 'easy' }, // a way to exclude; in this case "easy" tours
    //   },
    // },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1; // 2021

  const plan = await Tour.aggregate([
    {
      $unwind: `$startDates`,
    },
    {
      $match: {
        // all tours in the year 2021 or "year"
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: `$startDates` },
        numTours: { $sum: 1 },
        tourNames: { $push: `$name` },
      },
    },
    {
      $addFields: {
        month: `$_id`,
      },
    },
    {
      $project: {
        _id: 0, // 1 - id shows up, 0 - id does not show up
      },
    },
    { $sort: { numTourStarts: -1 } },
  ]);

  res.status(200).json({
    status: 'success',
    numResults: plan.length,
    data: {
      plan,
    },
  });
});
