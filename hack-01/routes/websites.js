const express = require('express')
const siteRouter = express.Router()

siteRouter.use((req, res, next) => {
  console.log('middleware called from the siteRouter');

  // key/val pairs can be "passed" to the next middleware or route fns by attaching
  // properties to `res.locals`
  res.locals.other = 'nypost.com';

  next();
});

siteRouter.get('/', (req, res) => {
  const websites = [
    'nytimes.com',
    'newyorker.com',
    'instagram.com',
    'csstricks.com',
    res.locals.other
  ]

  res.json({ websites });
})

module.exports = {
  siteRouter
};
