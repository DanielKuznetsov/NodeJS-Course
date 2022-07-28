// const fs = require('fs');
const Tour = require(`.././models/tourModel`);

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

exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime);
  // console.log(req.query);
  try {
    // BUILD QUERY

    // 1A) Filtering...
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering...
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\bgte|gt|lte|lt\b/g, (match) => `$${match}`)
    ); // "g" is needed to repalace all occurances and not just the first one, "\b" is specified to look for those exact words

    let query = Tour.find(queryStr);

    // 2) Sorting...
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt'); // if no sort specified, documents will be stored by newest
    }

    // 3) Field limiting...
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // "-" (minus) means is do disclude some fields in the query string, except the "__v" field (- is exclusion)
    }

    // 4) Pagination...
    const page = req.query.page * 1 || 1; // defining default values
    const limit = req.query.limit * 1 || 100; // page limiting
    const skip = (page - 1) * limit;

    // page=2&limit=10, 1-10, page 1, 11-20, page 2, 21-30, page 3
    query = query.skip(skip).limit(limit); // for the Nth page

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new error('This page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({_id: req.params.id})

    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }

  // console.log(req.params);
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'Success',
  //   data: {
  //     tour,
  //   },
  // });
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save();

  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'failed',
      message: err.message,
    });
  }

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
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return new modified document
      runValidators: true, // checks the type
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }

  // console.log(req.body);

  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour: `<Updated tour here...>`,
  //   },
  // });
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: err.message,
    });
  }

  // 204 means no content
  // res.status(204).json({
  //   status: 'success',
  //   data: 'null',
  // });
};
