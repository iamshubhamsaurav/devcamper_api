const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

//Security Modules
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimiter = require('express-rate-limit');
const hpp = require('hpp');

dotenv.config({ path: './config/config.env' });
connectDB();

const bootcampRoute = require('./routes/bootcamps');
const courseRoute = require('./routes/courses');
const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const reviewsRoute = require('./routes/reviews');

const app = express();

app.use(express.json());

app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//File Upload Middleware
app.use(fileUpload());

// Security Middlewares

//Sanitize data
app.use(mongoSanitize());
//Set Security headers
app.use(helmet());
//Prevent XSS - Cross site scripting attack
app.use(xssClean());
// Limiting requests
app.use(
  rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, //  Max 100 request in the set duration
  })
);
// Prevent Http params pollution
app.use(hpp());

//Static Files
// app.use(express.static('./public'));
//but the better way to do this is
app.use(express.static(path.join(__dirname, 'public')));

//Mounting router
app.use('/api/v1/bootcamps', bootcampRoute);
app.use('/api/v1/courses', courseRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/reviews', reviewsRoute);

app.use('*', (req, res, next) => {
  res
    .status(200)
    .json({ success: false, message: `Route ${req.baseUrl} Does Not Exists` });
});

//ErrorHandler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Listening to Server on port: ${PORT}`.green);
});

//Unhandled Promise Rejection
process.on('unhandledRejection', (err, promise) => {
  console.log(`ERROR ${err.message}`.red);
  server.close(() => process.exit(1));
});
