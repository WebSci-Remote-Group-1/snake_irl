/*
 * Core functions of the snake_irl API
 */

// Package imports
const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const config = require('config');
require('dotenv').config();

// Homebrew imports
const MGDB_PlayerInterface = require('./lib/player_lib');
const VisualizationUtil = require('./lib/visualization_lib');

// Globals
const app = express();
const port = config.get('api.port');
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
app.get(api_path + '/player/:username', async (req, res) => {
  let response = null;
  try {
    response = await MGDB_PlayerInterface.fetchUser(req.params.username);
    response.status == 0 ? (response.status = 200) : (response.status = 500);
  } catch (err) {
    response = { status: 200, message: err };
  } finally {
    res.status(response.status).json(response);
  }
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
app.get(api_path + '/data/:datatype', async (req, res) => {
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
      res.send(await VisualizationUtil.serializeUsers(mongoOptions));
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
