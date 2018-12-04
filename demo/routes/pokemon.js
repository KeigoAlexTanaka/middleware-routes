const express = require('express');

const pokemonRouter = express.Router();

pokemonRouter.use((req, res, next) => {
  console.log('middleware called from the pokemonRouter');

  // key/val pairs can be "passed" to the next middleware or route fns by attaching
  // properties to `res.locals`
  res.locals.other = 'mewtwo';

  next();
});

pokemonRouter.get('/', (req, res) => {
  const pokemon = [
    'bulbasaur',
    'charmander',
    'squirtle',
    'pikachu',
    res.locals.other // this value is supplied by the previous middleware function
  ];

  res.json({ pokemon });
});

module.exports = {
  pokemonRouter
};
