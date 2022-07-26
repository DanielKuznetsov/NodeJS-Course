// const fs = require('fs');
const Tour = require(`.././models/tourModel`);
// const APIfeatures = require(`../utilities/apiFeatures.js`);
const AppError = require(`../utilities/appError.js`);
const catchAsync = require('./../utilities/catchAsync');
const factory = require('../controllers/handlerFactory');
const multer = require('multer'); // upload images
const sharp = require('sharp'); // library for image processing needs

// All of this data is coming from an JSON file that should come from a database
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

const multerStorage = multer.memoryStorage(); // will be stored as a buffer and then be available on req.file.buffer

// We do not want to allow file images but only photos
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image. Please upload only images!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
}); // For file uploads

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  {
    name: 'images',
    maxCount: 3,
  },
]);

// upload.single('image');
// upload.array('images', 5);

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  // console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333) // 3 to 2 ratio
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // 2) Other images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, index) => {
      // ! Do not use forEach() because it returns another promise
      const filename = `tour-${req.params.id}-${Date.now()}-${index + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333) // 3 to 2 ratio
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);

      req.body.images.push(filename);
    })
  );

  console.log(req.body);
  next();
});

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

// '/tours-within/:distance/center/:latlng/unit/:unit'
// /tours-within/233/center/40.76504575147203, -73.9803745258028/unit/mile
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const radius = unit === 'mi' ? distance / 3693.2 : distance / 6378.1; // converting to radians

  if (!lat || !lng) {
    next(new AppError('Please provide a latitude and longitude.', 400));
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  // console.log(radius, lat, lng, distance, unit);

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitutr and longitude in the format lat,lng.',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      data: distances,
    },
  });
});
