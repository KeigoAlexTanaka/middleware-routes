const express = require('express');
const logger = require('morgan');
const { pokemonRouter } = require('./routes/pokemon');

const PORT = 3000;

// this inits the main express app
const app = express();

// and this mounts the logger middleware
app.use(logger('dev'));

app.use((req, res, next) => {
  console.log('this gets called before any other middleware or route handler');
  next();
});

app.use((req, res, next) => {
  console.log('this middleware "throws" an error since it passes an argument to "next"');
  next(Error('ruh roh!'));
});

app.use((err, req, res, next) => {
  console.log('and this middleware will "catch" the error from the previous middleware');
  // uncomment this line to view a console logged version of the error and stack trace
  // console.log(err);
  console.log('still ok after logging that error!');
  next();
});

app.use('/pokemon', pokemonRouter);

// the main or "root" route
app.get('/', (req, res) => {
  res.json({msg: 'everything is fine for this route'});
});


// bind the app to a particular port and boot the server
app.listen(PORT, () => console.log('up and running'));
