const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors');
const passport = require('passport')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const mongoose = require('mongoose')
const User = require('./models/User')

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

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authRouter = require('./routes/auth')

app.use('/', indexRouter);
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

const MONGODB_URI = 'mongodb://localhost:27017/testdb'

mongoose
    .connect(MONGODB_URI, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(self => {
        console.log(`Connected succesfully to "${self.connection.name}"`)
      })
    .then(() => {
        User.create({email:'uhdweodhnow', name:'bdnewodnwe'})
            .then(()=> {
                mongoose.connection.close()
            })
        })
    .catch(error => console.error('Error connecting to database', error))

module.exports = app;
