const catchAsync = require('./../utilities/catchAsync');
const Review = require(`.././models/reviewModel`);

exports.createReview = catchAsync(async function (req, res, next) {
  // Allow nested routes, if they are not specified in the request body
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      newReview,
    },
  });
});

exports.getAllReviews = catchAsync(async function (req, res, next) {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    data: {
      reviews,
    },
  });
});
