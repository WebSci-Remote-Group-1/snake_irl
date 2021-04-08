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
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

// Example test endpoint
app.get(api_path + '/hello', (req, res) => {
  res.json({ status: 200, message: 'Hello world!' });
});

// Fetch player account information
app.get(api_path + '/player/:id', async (req, res) => {
  let response = null;
  try {
    response = await MGDB_PlayerInterface.fetchUser(req.params.id);
    response.status == 0 ? (response.status = 200) : (response.status = 420);
  } catch (err) {
    response = { status: 200, message: err };
  } finally {
    res.status(response.status).json(response);
  }
});

app.get(api_path + '/players', async (req, res) => {
  let response = null;
  try {
    response = await MGDB_PlayerInterface.fetchUsers();
    response.status == 0 ? (response.status = 200) : (response.status = 420);
  } catch (err) {
    response = { status: 200, message: err };
  } finally {
    res.status(response.status).json(response);
  }
});
