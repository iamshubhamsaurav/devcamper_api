const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');
const User = require('./models/User');
const Review = require('./models/Review');

mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8')
);

const courses = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8')
);

const users = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8')
);

const reviews = JSON.parse(fs.readFileSync(`${__dirname}/_data/reviews.json`));

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(users);
    await Review.create(reviews);
    console.log('Data Imported'.green.inverse);
    process.exit();
  } catch (error) {
    console.log('Cannot Create Bootcamp from seeder:', error);
    process.exit();
  }
};
const destroyData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Destroyed'.red.inverse);
    process.exit();
  } catch (error) {
    console.log('Cannot destroy data from seeder'.red);
    process.exit();
  }
};

const showBootcampData = async () => {
  try {
    const bootcamps = await Bootcamp.find();
    console.log({
      count: bootcamps.length,
      data: bootcamps,
    });
    process.exit();
  } catch (error) {
    console.log('Cannot display data from seeder'.red);
    process.exit();
  }
};

const showCourseData = async () => {
  try {
    const courses = await Course.find();
    console.log({
      count: courses.length,
      data: courses,
    });
    process.exit();
  } catch (error) {
    console.log('Cannopt display course data from seeder'.red);
    process.exit();
  }
};

const showUsers = async () => {
  try {
    const users = await User.find().select('+password');
    console.log({
      count: users.length,
      data: users,
    });
    process.exit();
  } catch (error) {
    console.log('Cannopt display users from seeder'.red);
    process.exit();
  }
};

const showReviews = async () => {
  try {
    const reviews = await Review.find();
    console.log({
      count: reviews.length,
      data: reviews,
    });
    process.exit();
  } catch (error) {
    console.log('Cannopt display reviews from seeder'.red);
    process.exit();
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else if (process.argv[2] === '-sb') {
  showBootcampData();
} else if (process.argv[2] === '-sc') {
  showCourseData();
} else if (process.argv[2] === '-su') {
  showUsers();
} else if (process.argv[2] === '-sr') {
  showReviews();
}
