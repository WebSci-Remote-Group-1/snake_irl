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
app.get(api_path + '/player/:id', (req, res) => {
  MGDB_PlayerInterface.fetchUser('west');
  res.json({ status: 200, message: 'You are pinging the players endpoint' });
});
