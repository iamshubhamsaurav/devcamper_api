const express = require('express');
const Review = require('../models/Review');

const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviews');

const router = express.Router();

//Middlewares
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(
      Review,
      { path: 'bootcamp', select: 'name description' },
      getReviews
    )
  )
  .post(createReview);

router.route('/:id').get(getReview).put(updateReview).delete(deleteReview);

module.exports = router;
