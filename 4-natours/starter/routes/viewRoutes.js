const express = require('express');
const viewController = require('../controllers/viewController');

const router = express.Router();

// Rendering "pug" file
router.get('/', viewController.getOverview);
router.get('/tour/:slug', viewController.getTour);

module.exports = router;
