const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/deploymentExample'
console.log('Connecting DB to ', MONGODB_URI)

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error('Error connecting to mongo', err));

const app = express();

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "https://clientnetlify.netlify.app"] //Swap this with the client url 
  })
);

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "secret",
    cookie: { maxAge: 1000 * 60 * 60 }
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, '../frontend/build')));

const linkedinResultsRouter = require('./routes/linkedinResults');
// const indeedResultsRouter = require('./routes/indeedResults');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth')

// app.use('/', indeedResultsRouter);
app.use('/search', linkedinResultsRouter);
app.use('/', authRouter)
app.use('/users', usersRouter);

// let client = path.join(__dirname + '../public/index.html')

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({message:'error'});
});

module.exports = app;
