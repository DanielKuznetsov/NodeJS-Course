// const fs = require('fs');
const Tour = require(`.././models/tourModel`);
const APIfeatures = require(`../utilities/apiFeatures.js`);
const AppError = require(`../utilities/appError.js`);
const catchAsync = require('./../utilities/catchAsync');

// All of this data is coming from an JSON file that should come from a database
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// Check ID middleware -> will allow to run after the check
// ? exports.checkID = (req, res, next, value) => {
//   console.log(`Tour id is ${value}`);

//   if (value * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }

//   next();
// };

// This is checking if the user has inputed the tour name or price in the form
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }

//   next();
// };

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';

  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  // console.log(req.requestTime);
  // console.log(req.query);
  // alternative way of doing query manipulation is stored in the file: "./dev-data/queryNotes.js"

  // EXECUTE QUERY
  const features = new APIfeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tours = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  // .populate({
  //   path: 'guides',
  //   select: '-__v -passwordChangedAt',
  // }); // "populate" replaces the ID with the actual data whenever someone access getTour query
  // Tour.findOne({_id: req.params.id})

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      tour,
    },
  });

  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'Success',
  //   data: {
  //     tour,
  //   },
  // });
});

exports.createTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour({});
  // newTour.save();

  const newTour = await Tour.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });

  // // console.log(req.body);

  // const newId = tours[tours.length - 1].id + 1;
  // // Allows us to create a new Object by combining another Object
  // const newTour = Object.assign({ id: newId }, req.body);

  // tours.push(newTour);

  // // Overwrites the existing JSON file with a new ID object
  // fs.writeFile(
  //   `${__dirname}/dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   }
  // );
});

exports.updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // return new modified document
    runValidators: true, // checks the type
  });

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });

  // console.log(req.body);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: `<Updated tour here...>`,
  //   },
  // });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });

  // 204 means no content
  // res.status(204).json({
  //   status: 'success',
  //   data: 'null',
  // });
});

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
