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
const MGDB_GameInterface = require('./lib/game_lib');
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

// Logout
app.post(internal_path + '/logout', (req, res) => {
  console.log(`Logging out`);
  res.clearCookie('auth');
  res.json({});
});

// Fetch user
app.get(internal_path + '/getActiveUser', (req, res) => {
  const { auth } = req.cookies;
  if (!auth) {
    res.json({});
    return;
  }
  MGDB_PlayerInterface.fetchUserByAuth(auth)
    .then((user) => {
      // console.log(user);
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.json({});
    });
});

// Updates a user's profile data
app.post(internal_path + '/updateUserData', (req, res) => {
  const { auth } = req.cookies;
  if (!auth) {
    res.status(401).json({});
    return;
  }
  MGDB_PlayerInterface.updateUserData({...req.body, id: auth})
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

// Updates a user's password
app.post(internal_path + '/updateUserPassword', (req, res) => {
  const { auth } = req.cookies;
  if (!auth) {
    res.status(401).json({});
    return;
  }
  MGDB_PlayerInterface.fetchUserByAuth(auth)
    .then((user) => {
      bcrypt.compare(req.body.old, user.password, (err, result) => {
        if (err) res.status(500).json({ error: err });
        else if (result) {
          bcrypt.hash(req.body.new, 10, (errr, hash) => {
            if (errr) res.status(500).json({ error: errr });
            MGDB_PlayerInterface.updateUserPassword({ id: auth, password: hash })
              .then((response) => {
                res.status(200).json(response);
              })
              .catch((errrr) => {
                console.error(errrr);
                res.status(500).json({ error: err });
              });
          });
        }
        else {
          res.status(400).json({});
        }
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
});

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

  if (req.body.demographics.age < 13) {
    res.status(400).json({
      error: 'You must be 13 years or older to play!',
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

// Get user's maps
app.get(internal_path + '/getActiveUserMaps', (req, res) => {
  console.log("Getting maps");
  const {auth} = req.cookies;
  if (!auth) {
    res.json([]);
    return;
  }
  MGDB_MapInterface.fetchMapsFromAuth(new ObjectID(auth)).then(maps => {
    res.json(maps);
  }).catch(err => {
    res.json([]);
  })
})

// Create map
app.post(internal_path + '/createMap', (req, res) => {
  console.log("attempting to create map");
  const {auth} = req.cookies;
  if (!auth) {
    res.json({});
    return;
  }
  const {title, description} = req.body;
  if (!title || !description) {
    res.json({});
    return;
  }
  let {pointsOfInterest} = req.body;
  if (!Array.isArray(pointsOfInterest)) pointsOfInterest = [];
  pointsOfInterest = pointsOfInterest.map(poi => {
    if (!poi instanceof Object) {
      return null;
    }
    if (!poi.name || isNaN(poi.lat) || isNaN(poi.long)) {
      return null;
    }
    return {
      name: poi.name,
      lat: Number(poi.lat),
      long: Number(poi.long),
    };
  }).filter(poi => poi);
  const mapDetails = {
    title,
    description,
    mapOwner: new ObjectID(auth),
    top: null,
    pointsOfInterest,
  };
  MGDB_MapInterface.createMap(mapDetails).then(result => {
    // console.log(result);
    res.json({message: "Success"});
  })
})

// Update map
app.post(internal_path + '/updateMap', (req, res) => {
  console.log("attempting to update map");
  const {auth} = req.cookies;
  if (!auth) {
    res.json({});
    return;
  }
  const {title, description, _id} = req.body;
  if (!title || !description) {
    res.json({});
    return;
  }
  let {pointsOfInterest} = req.body;
  if (!Array.isArray(pointsOfInterest)) pointsOfInterest = [];
  pointsOfInterest = pointsOfInterest.map(poi => {
    if (!poi instanceof Object) {
      return null;
    }
    if (!poi.name || isNaN(poi.lat) || isNaN(poi.long)) {
      return null;
    }
    return {
      name: poi.name,
      lat: Number(poi.lat),
      long: Number(poi.long),
    };
  }).filter(poi => poi);
  const mapDetails = {
    title,
    description,
    // mapOwner: new ObjectID(auth),
    // top: null,
    pointsOfInterest,
  };
  // console.log(mapDetails);
  MGDB_MapInterface.updateMap(new ObjectID(_id), new ObjectID(auth), mapDetails).then(result => {
    // console.log(result);
    res.json({message: "Success"});
  }).catch(err => {
    console.log(err);
    res.json({});
  })
})

// Delete map
app.post(internal_path + '/deleteMap', (req, res) => {
  console.log("Attempting to delete map");
  const {auth} = req.cookies;
  if (!auth) {
    res.json({});
    return;
  }
  const {mapID} = req.body;
  MGDB_MapInterface.deleteMap(new ObjectID(mapID), new ObjectID(auth)).then(result => {
    // console.log(result);
    res.json({message: "Success"});
  }).catch(err => {
    console.log(err);
    res.json({});
  })
})

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
      let mongoOptions = { projection: { _id: 0, username: 0, socialMedia: 0, maps: 0, password: 0 } }; // Projection for mongo's find
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

app.get(api_path + '/ranks', (req, res) => {
	MGDB_PlayerInterface.fetchLeaderboard(null)
		.then(resp => res.json(resp))
		.catch(err => res.status(500).json(err));
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
  if (req.cookies.auth === null || req.cookies.auth === undefined) {
    res.status(401).json({
      error: 'No auth cookie!',
    });
  }
  var gameObj = {
    user: req.cooies.auth,
    points: req.body.points,
    date: req.body.date,
    map: req.body.map,
  };
  var timeUpdateObj = {
    username: req.cookies.auth,
    time: req.body.elapsed,
  };
  MGDB_GameInterface.createGame(gameObj).then((resp) => {
    resp
      ? MGDB_PlayerInterface.updateUserTime(timeUpdateObj).then((resp) => {
          resp
            ? res.json({ message: 'Game posted' })
            : res.status(500).json({ error: 'Could not update time ' });
        })
      : res.status(500).json({ error: 'Could not insert game' });
  });
});

if (process.env.NODE_ENV == 'production') {
  const siteRoot = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(siteRoot));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: siteRoot });
  });
}
