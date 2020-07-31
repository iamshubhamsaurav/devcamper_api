const mongoose = require('mongoose');

const ReviewSchema = mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title'],
    maxlength: 128,
  },
  text: {
    type: String,
    required: [true, 'Please add text'],
  },
  ratings: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add rating between 1 and 10'],
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: [true, 'Please add a bootcamp'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Please add a user'],
  },
});

module.exports = mongoose.model('Review', ReviewSchema);
