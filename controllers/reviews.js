const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/Review');
const ErrorResponse = require('../utils/errorResponse');

//@desc     Get All Reviews
//@route    GET /api/v1/reviews
//@route    POST /api/v1/bootcamp/:bootcampId/reviews
//@route    POST /api/v1/user/:userId/reviews
//@access   Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = Review.find({ bootcamp: req.params.bootcampId });
    res
      .status(200)
      .json({ success: true, count: review.length, data: reviews });
  } else if (req.params.userId) {
    const reviews = Review.find({ user: req.params.userId });
    res
      .status(200)
      .json({ success: true, count: review.length, data: reviews });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc     Get A Review
//@route    GET /api/v1/reviews/:id
//@access   Public
exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    return new ErrorResponse('Review not found', 404);
  }
  res.status(200).json({ success: true, data: review });
});

//@desc     Create Review
//@route    POST /api/v1/bootcamp/:bootcampId/reviews
//@access   Private
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user._id;
  const review = await Review.create(req.body);
  res.status(200).json({ success: true, data: review });
});

//@desc     Update a Review
//@route    PUT /api/v1/reviews/:id
//@access   Private
exports.updateReview = asyncHandler(async (req, res, next) => {
  if (req.body.bootcamp || req.body.user) {
    return new ErrorResponse('bootcamp and user cannot be changed', 404);
  }
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!review) {
    return new ErrorResponse('Review not found', 404);
  }
  res.status(200).json({ success: true, data: review });
});

//@desc     Delete A Review
//@route    DELETE /api/v1/reviews/:id
//@access   Private
exports.deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);
  if (!review) {
    return new ErrorResponse('Review not found', 404);
  }
  review = undefined;
  res.status(200).json({ success: true, data: {} });
});
