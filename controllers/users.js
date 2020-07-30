const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');

// @desc      Get Users
// @route     GET /api/v1/users
// @access    Private
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get User
// @route     GET /api/v1/users/:id
// @access    Private
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User does not exist', 404));
  }
  res.status(200).json({ success: true, data: user });
});

// @desc      Create User
// @route     POST /api/v1/users/
// @access    Private
exports.createUser = asyncHandler(async (req, res, next) => {
  req.body.role = 'user';
  const user = await User.create(req.body);
  res.status(200).json({ success: true, data: user });
});

// @desc      Update User
// @route     PUT /api/v1/users/
// @access    Private
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    return next(new ErrorResponse('User does not exist', 404));
  }
  res.status(200).json({ success: true, data: user });
});

// @desc      Delete User
// @route     DELETE /api/v1/users/
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new ErrorResponse('User does not exist', 404));
  }
  user = undefined;
  res.status(200).json({ success: true, data: {} });
});
