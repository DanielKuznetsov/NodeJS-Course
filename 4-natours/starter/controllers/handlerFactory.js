const catchAsync = require('./../utilities/catchAsync');
const AppError = require(`../utilities/appError.js`);
const APIfeatures = require(`../utilities/apiFeatures.js`);

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return new modified document
      runValidators: true, // checks the type
    });

    if (!document) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: document,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // const newTour = new Tour({});
    // newTour.save();

    const newDoc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: newDoc,
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

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    // const doc = await Model.findById(req.params.id).populate('reviews');

    // .populate({
    //   path: 'guides',
    //   select: '-__v -passwordChangedAt',
    // }); // "populate" replaces the ID with the actual data whenever someone access getTour query
    // Tour.findOne({_id: req.params.id})

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'Success',
      data: {
        data: doc,
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

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.requestTime);
    // console.log(req.query);
    // alternative way of doing query manipulation is stored in the file: "./dev-data/queryNotes.js"

    // To allow for nested get reviews on Tour
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    // EXECUTE QUERY
    const features = new APIfeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'Success',
      results: docs.length,
      data: {
        data: docs,
      },
    });
  });
