/*
 * Functions responsible for managing interactions between the API and updating
 * the map collection(s) in the MongoDB database
 */

// Package imports
const config = require('config');

// Homebrew imports
const MGDB_Core = require('./mongo_lib');

// Globals
const mongoURI = MGDB_Core.constructProperMongoURI('MGDB_GAMEMANAGER');

/*
 * =======================================
 * Functions
 * =======================================
 */

// Create game object
const createGame = (gameObj) =>
  new Promise((resolve, reject) => {
    MGDB_Core.insertOne(
      mongoURI,
      config.get('database.played_games'),
      gameObj
    ).then((resp) => {
      console.log(resp);
      resolve(resp.insertedCount !== 0);
    });
  });

module.exports = { createGame };
