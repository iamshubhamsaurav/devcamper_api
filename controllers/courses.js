const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

// @desc      Get courses
// @route     GET /api/v1/courses
// @route     GET /api/v1/bootcamps/:bootcampId/courses
// @access    Public
exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
    // courses = await Course.find().populate({
    //   path: 'bootcamp',
    //   select: 'name description',
    // });
  }
  // res.status(200).json({ success: true, count: courses.length, data: courses });
});

// @desc      Get single course
// @route     GET /api/v1/courses/:id
// @access    Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name',
  });
  //To populate the entire bootcamp use .populate('bootcamp)
  if (!course) {
    return next(
      new ErrorResponse(`Course Not Found with the id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: course });
});

// @desc      Add course
// @route     POST /api/v1/bootcamps/:bootcampId/courses
// @access    Private
exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  const bootcamp = Bootcamp.findById(req.params.bootcampId);
  if (!bootcamp) {
    return next(
      new ErrorResponse(
        `Not found Bootcamp with the id of ${req.params.bootcampId}`,
        404
      )
    );
  }

  // Checking if the user or admin or the user is the owner
  if (bootcamp.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        'You are not authorized to add a course to the bootcamp',
        403
      )
    );
  }
  // Adding the logged in user to the course
  req.body.user = req.user._id;

  const course = await Course.create(req.body);
  // console.log(req.body);
  res.status(200).json({ success: true, data: course });
});
// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404)
    );
  }
  // Check if the user is course owner or admin
  if (course.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You are not authorized to update this course', 403)
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: course });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(
      new ErrorResponse(`Course not found with the id of ${req.params.id}`, 404)
    );
  }
  // Check if the user is course owner or admin
  if (course.user.toString() !== req.user._id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse('You are not authorized to delete this course', 403)
    );
  }
  // await Course.findByIdAndDelete(req.params.id);
  await course.remove(); // Another way to delete a course. But only works on instance though
  res.status(200).json({ success: true, data: {} });
});
