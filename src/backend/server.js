/*
 * Core functions of the snake_irl API
 */

// Package imports
const express = require('express');
const path = require('path');
const config = require('config');
const { ObjectID } = require('mongodb');
require('dotenv').config();

// Homebrew imports
const MGDB_PlayerInterface = require('./lib/player_lib');
const MGDB_MapInterface = require('./lib/map_lib');
const VisualizationUtil = require('./lib/visualization_lib');

// Globals
const app = express();
const port =
  process.env.PORT == null ? config.get('api.port') : process.env.PORT;
const api_path = config.get('api.api_path');

app.use(express.json());

/*
 * =======================================
 * Functions
 * =======================================
 */

// Spawn express server
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

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
