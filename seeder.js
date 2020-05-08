const fs = require('fs');
const colors = require('colors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/config.env' });

const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');

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

const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
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

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  destroyData();
} else if (process.argv[2] === '-sb') {
  showBootcampData();
} else if (process.argv[2] === '-sc') {
  showCourseData();
}
