const catchAsync = require('./../utilities/catchAsync');
const Review = require(`.././models/reviewModel`);

exports.createReview = catchAsync(async function (req, res, next) {
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
