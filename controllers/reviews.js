const asyncHandler = require('../utils/asyncHandler');
const Review = require('../models/Review');
const Bootcamp = require('../models/Bootcamp');
const User = require('../models/User');

//@desc     Delete a bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@access   Private
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
