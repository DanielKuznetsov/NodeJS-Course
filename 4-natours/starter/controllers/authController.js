const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utilities/catchAsync');
const AppError = require(`../utilities/appError.js`);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  // ! This is for security reasons and must be implemented in this way
  // Now we allow only to store data that's below and not any other field of data
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    // !  if "user" is true, it will run the return and not run the "await user..."
    // otherwise, it will run the "await user...", and if it is true, it will run the code below
    return next(new AppError('Incorrect email or password'), 401);
  }

  // 3) If everything is OK, send json token back to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});
