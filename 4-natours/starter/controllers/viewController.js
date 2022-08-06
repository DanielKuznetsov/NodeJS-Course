const express = require('express');

exports.getOverview = function (req, res) {
  res.status(200).render('overview', {
    title: 'All Tours', // ! this is a variable in pug file
  });
};

exports.getTour = function (req, res) {
  res.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
  });
};
