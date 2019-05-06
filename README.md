# Routes and Middleware

_Introduction_

Having seen basic routing and response handling in express, it's time to take a closer look at organizing an app's API as well as applying middleware actions

### Objectives
- Identify middleware functions in an Express app
- Write and apply custom middleware functions
- Define and apply a "mini-app" Router to the main app
- Explain when to extract out sub-routes from the main `server.js` file

## Middleware

_[Straight from the Express docs:](https://expressjs.com/en/guide/using-middleware.html)_

> Express is a routing and middleware web framework that has minimal functionality of its own: An Express application is essentially a series of middleware function calls.

> Middleware functions are functions that have access to the request object (req), the response object (res), and the next middleware function in the application’s request-response cycle. The next middleware function is commonly denoted by a variable named next.

> Middleware functions can perform the following tasks:

> - Execute any code.
- Make changes to the request and the response objects.
- End the request-response cycle.
- Call the next middleware function in the stack.
- If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.

### Application Middleware

Perhaps the most straightforward type of middleware is what we call "application-level middleware".  It is "mounted" or attached to the main app:

```js
const app = express();

app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next();
});
```

We could also apply a particular middleware function to a single route:

```js
app.use('/user/:id', function (req, res, next) {
  console.log('Request Type:', req.method);
  next();
});
```

### Error-handling MiddleWare

From the _[Express Docs](https://expressjs.com/en/guide/using-middleware.html#middleware.error-handling)_

> Error-handling middleware always takes four arguments. You must provide four arguments to identify it as an error-handling middleware function. Even if you don’t need to use the next object, you must specify it to maintain the signature. Otherwise, the next object will be interpreted as regular middleware and will fail to handle errors.

```js
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
```

These sorts of middleware are like `catch` blocks that handle any errors that have been thrown _up to that point_ in the request/response life cycle.

### Third-Party / Custom middleware
Other middleware functions can be mounted to an app (or router) with [app.use()](https://github.com/Axylos/adventcode2018)

We've seen this sort with the `bodyParser` and `logger` middlewares:

```js
const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');

const PORT = 3000;

// this inits the main express app
const app = express();

// and here are the middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
```

### Mini-Exercise: Hackety Hack

In a spare directory init a new npm project
- Install express, nodemon, and morgan
- Set up a `server.js` file with a single root route that returns a simple greeting message as JSON.
- Write a middleware function that prints "hello from middleware" to the console
- Make sure this middleware function is mounted prior to the root route handler

*Bonus*
- Write a second route handler for GET `/goodbye` that send a goodbye message as JSON
- Mount a middleware function _for just this route_ that prints "hello from a single route's middleware" to the console

## Router

From the _[Router docs](https://expressjs.com/en/4x/api.html#router)_
> A router object is an isolated instance of middleware and routes. You can think of it as a “mini-application,” capable only of performing middleware and routing functions. Every Express application has a built-in app router.

> A router behaves like middleware itself, so you can use it as an argument to app.use() or as the argument to another router’s use() method.

> The top-level express object has a Router() method that creates a new router object.

> Once you’ve created a router object, you can add middleware and HTTP method routes (such as get, put, post, and so on) to it just like an application.


Here is the same `pokemon` example from before but this time using a `Router` rather than `app`.

```js
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
```

Now, this `pokemonRouter` can be imported in `server.js` and mounted to the main app.  This particular set of routes will be nested under `/pokemon/`:

```js
app.use('/pokemon', pokemonRouter);
```

Such nesting can go arbitrarily deep.

### Mini-Exercise Hackety Hack 3
- init a new npm project
- install `express`, `nodemon`, and `morgan`.
- Set up a simple `server.js` file
- create a `routes` directory with a `websites.js` file
- Inside `websites.js` create a `siteRouter` with an index ('/') route and return an array of your favorite websites
- make sure to export the `siteRouter`
- In `server.js` `require` the `siteRouter` and mount it to `app`.

Yay!