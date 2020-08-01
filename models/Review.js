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

// Prevent user from submiting more than 1 review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

//Static method to calculate the average rating and save
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$rating' },
      },
    },
  ]);
  //Now we have average Cost and we want to save it to the database
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: obj[0].averageRating,
    });
  } catch (error) {
    console.error(error);
  }
};
//Get averageCost after saving
ReviewSchema.post('save', async function (next) {
  await this.constructor.getAverageRating(this.bootcamp);
});
//Get averageCost before removing
ReviewSchema.pre('remove', async function (next) {
  await this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
