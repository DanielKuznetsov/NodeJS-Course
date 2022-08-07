const Tour = require(`.././models/tourModel`);
const catchAsync = require('./../utilities/catchAsync');
const express = require('express');

exports.getOverview = catchAsync(async function (req, res, next) {
  // 1) Get all the tour data from collection
  const tours = await Tour.find();

  // 2) Build template

  // 3) Render the template using the tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours', // ! this is a variable in pug file
    tours,
  });
});

exports.getTour = catchAsync(async function (req, res, next) {
  // 1) Get the data, for the requested tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 2) Build template

  // 3) Render data from step 1
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

exports.getLoginForm = function (req, res) {
  res.status(200).render('login', {
    title: 'Loging in..',
  });
};
