/*
 * Core functions of the snake_irl API
 */

// Package imports
const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
require('dotenv').config();

// Homebrew imports
const MGDB_PlayerInterface = require('./lib/player_lib');

// Globals
const app = express();
const port = 3001;
const api_path = '/api/v1';

app.use(express.json());

/*
 * =======================================
 * Functions
 * =======================================
 */
app.listen(port, () => {
  console.log(`Listening on port ${port}`);

  MGDB_PlayerInterface.createUser(null, null);
});

// Example test endpoint
app.get(api_path + '/hello', (req, res) => {
  res.json({ status: 200, message: 'Hello world!' });
});

// Fetch player account information
app.get(api_path + '/player/:id', (req, res) => {
  console.log(req.params.id);
  res.json({ status: 200, message: 'You are pinging the players endpoint' });
});
