/*
 * Functions responsible for managing interactions between the API and updating
 * the player collection(s) in the MongoDB database
 */

// Package imports
require('dotenv').config();
const config = require('config');

// Homebrew imports
const MGDB_Core = require('./mongo_lib');

// Globals
const mongoURI = MGDB_Core.constructProperMongoURI('MGDB_PLAYERMANAGER');

/*
 * =======================================
 * Functions
 * =======================================
 */
const createUser = async (userDetails) => {
  console.log(mongoURI);
};

const fetchUser = async (username) => {
  let mongoConn = await MGDB_Core.fetchMongoConnection(mongoURI);

  if (mongoConn == null) {
    console.error('<player_lib.fetchUser> ERROR: No client object returned');
    return { status: -1, message: 'ERROR: Unable to connect to mongo' };
  }

  let playerColl = mongoConn
    .db('snake_irl')
    .collection(config.get('database.player_accounts'))
    .findOne();
  // .collection(config.get('database.player_accounts'));
  playerColl
    .then((val) => {
      console.log(val);
    })
    .then(() => mongoConn.close());
};

module.exports = { createUser, fetchUser };
