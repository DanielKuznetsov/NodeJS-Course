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

exports.getTour = function (req, res) {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
