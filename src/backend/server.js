/*
 * Core functions of the snake_irl API
 */

// Package imports
const express = require('express');
const path = require('path');
const config = require('config');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// Homebrew imports
const MGDB_PlayerInterface = require('./lib/player_lib');
const MGDB_MapInterface = require('./lib/map_lib');
const MGDB_GameInterface = require('./lib/game_lib')
const VisualizationUtil = require('./lib/visualization_lib');

// Globals
const app = express();
const port =
  process.env.PORT == null ? config.get('api.port') : process.env.PORT;
const api_path = config.get('api.api_path');
const internal_path = config.get('api.internal_api_path');

// Middleware injection
app.use(express.json());
app.use(cookieParser());

/*
 * =======================================
 * Functions
 * =======================================
 */

// Spawn express server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

/*
 * =======================================
 * Internal Endpoints
 * =======================================
 */

/* Attempt to login a user
 *
 * Upon successful login an auth cookie is set with the user's ID. This will
 * represent how the user authenticates privileged actions
 *
 * This requires a JSON body object of the form:
 *	{
 *		username: <Username>,
 *		password: <Plaintext password>,
 *	}
 */
app.post(internal_path + '/login', (req, res) => {
  if (
    req.body.username === null ||
    req.body.username === undefined ||
    req.body.password === null ||
    req.body.password === undefined
  ) {
    console.log('Missing field');
    res.status(400).json({
      error: 'You are missing a required field',
    });

    return;
  }

  const username = req.body.username;
  const password = req.body.password;

  MGDB_PlayerInterface.userExists(username).then((exists) => {
    if (!exists) {
      res.status(400).json({ error: 'User does not exist' });
      return;
    }

    MGDB_PlayerInterface.fetchUser(username).then((user) => {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) res.status(500).json({ error: err });
        else if (result) {
          MGDB_PlayerInterface.userLogin(username);
          res
            .cookie('auth', new ObjectID(user._id).toString())
            .json({ message: 'Authenticated' });
        } else res.json({ message: 'Not authenticated' });
      });
    });
  });
});

/* Add game data to the database
 *
 * Attempt to upload a game data object to database
 * 
 * Upon successful upload, the database gains the object sent at the end of a 
 * game.
 * 
 * This requires a JSON body object of the form:
 *  {
 *    points: <number of points>,
 *    date: <date object>
 *    map: ID of the map that was played
 *  }
 * 
 * This endpoint also uses the auth cookie to verify that the user is logged in.
 */
app.post(api_path + '/endGame', (req, res) => {
  if (
    req.body.points === null ||
    req.body.points === undefined ||
    req.body.date === null ||
    req.body.date === undefined ||
    req.body.map === null ||
    req.body.map === undefined 
  ) {
    res.status(400).json({
      error: 'You are missing a required field',
    });
    return;
  }
  if (
    req.cookies.auth === null ||
    req.cookies.auth === undefined
  ) {
    res.status(401).json({
      error: 'No auth cookie!'
    })
  }
  var gameObj = {
    user: req.cookies.auth,
    points: req.body.points,
    date: req.body.date,
    map: req.body.map
  }
  console.log(JSON.stringify(gameObj))
  MGDB_GameInterface.createGame(gameObj).then((resp) => {
    resp
      ? res.json({ message: 'Game added!' })
      : res.status(500).json({ error: 'Could not insert game' });
  });
})

/* Register a new user
 *
 * Note that this endpoint does not set a user auth cookie, users will need to
 * login after registering to be allowed privileged actions
 *
 * This requires a JSON body object of the form:
 * {
 *	username: <Username>,
 *	password: <Plaintext password>,
 *	demographics: {
 *		age: <Player age>,
 *		homebase: {
 *			lat: <Player latitude>,
 *			long: <Player longitude>
 *		}
 *	}
 * }
 */
app.post(internal_path + '/register', (req, res) => {
  if (
    req.body.username === null ||
    req.body.username === undefined ||
    req.body.password === null ||
    req.body.password === undefined ||
    req.body.demographics === null ||
    req.body.demographics === undefined ||
    req.body.demographics.age === null ||
    req.body.demographics.age === undefined ||
    req.body.demographics.homebase === null ||
    req.body.demographics.homebase === undefined ||
    req.body.demographics.homebase.lat === null ||
    req.body.demographics.homebase.lat === undefined ||
    req.body.demographics.homebase.long === null ||
    req.body.demographics.homebase.long === undefined
  ) {
    res.status(400).json({
      error: 'You are missing a required field',
    });
    return;
  }

  MGDB_PlayerInterface.userExists(req.body.username).then((exists) => {
    exists
      ? res.status(400).json({ error: 'User already exists' })
      : bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) res.status(500).json({ error: err });
          const userDoc = {
            username: req.body.username,
            password: hash,
            demographics: req.body.demographics,
          };

          MGDB_PlayerInterface.createUser(userDoc).then((resp) => {
            resp
              ? res.json({ message: 'User registered' })
              : res.status(500).json({ error: 'Could not insert user' });
          });
        });
  });
});

/*
 * =======================================
 * API Endpoints
 * =======================================
 */

// Example test endpoint
app.get(api_path + '/hello', (req, res) => {
  res.json({ status: 200, message: 'Hello world!' });
});

// Fetch player account information
app.get(api_path + '/player/:username', (req, res) => {
  let response = null;
  let status = 200;
  MGDB_PlayerInterface.fetchUser(req.params.username)
    .then((resp) => {
      response = resp;
      response == null ? (status = 500) : null;
    })
    .catch((err) => {
      response = { error: err };
    })
    .finally(() => res.status(status).json(response));
});

// Fetch map information
app.get(api_path + '/maps/:id?', (req, res) => {
  let response = null;
  let status = 200;

  if (req.params.id == null) {
    query = {};
    if (req.query.author) query.mapOwner = new ObjectID(req.query.author);
    MGDB_MapInterface.fetchMaps(query)
      .then((resp) => {
        response = resp;
        response == null ? (status = 500) : null;
      })
      .catch((err) => {
        console.error('ERROR: ', err);
        response = { error: err };
      })
      .finally(() => res.status(status).json(response));
  } else
    MGDB_MapInterface.fetchMap(new ObjectID(req.params.id))
      .then((resp) => {
        response = resp;
        response == null ? (status = 500) : null;
      })
      .catch((err) => {
        console.error('ERROR: ', err);
        response = { error: err };
      })
      .finally(() => res.status(status).json(response));
});

/*
 * This endpoint supports multiple datatypes for fetching data from mongo, as well as supporting query parameters for query filtering
 *
 * For example to get all usernames and total points the url would be <protocol + base domain>/<api_path>/data/players?filters=username,points
 *
 * Implemented datatypes:
 *	- players
 *
 * Valid query string elements:
 *  - filter -> comma seperated strings where each string is a field in the mongo document being queried to display
 *  - showID -> boolean which includes the _id field in the return value when provided
 */
app.get(api_path + '/data/:datatype', (req, res) => {
  switch (req.params.datatype) {
    case 'players': {
      let mongoOptions = { projection: { _id: 0 } }; // Projection for mongo's find
      req.query.filters
        ? req.query.filters
            .split(',')
            .map((field) => (mongoOptions.projection[field] = 1))
        : null;

      req.query.showID && req.query.showID == 1 // If showID is 1 then include in the projection
        ? (mongoOptions.projection._id = 1)
        : null;

      VisualizationUtil.serializeUsers(mongoOptions).then((result) => {
        res.status(200).json({ payload: result });
      });

      break;
    }

    default: {
      res.status(400).json({
        status: 400,
        message: `Unknown datatype: ${req.params.datatype}`,
      });
      break;
    }
  }
});

if (process.env.NODE_ENV == 'production') {
  const siteRoot = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(siteRoot));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: siteRoot });
  });
}
