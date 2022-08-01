const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');

const router = express.Router();

// Checking if the ID works -> if the ID is actually valid
// router.param('id', tourController.checkID);

router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
router.route('/tour-stats').get(tourController.getTourStats);

router
  .route('/top-5-cheap-tours')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
// .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = router;
