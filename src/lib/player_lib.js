/*
 * Functions responsible for managing interactions between the API and updating
 * the player collection(s) in the MongoDB database
 */

// Package imports
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

// Takes in user details and creates the user on mongoDB
const createUser = async (userDetails) => {
  console.log(mongoURI);
};

// Fetch user with username == usrname from db, optionally query can be filtered
const fetchUser = (usrname, filter = null) =>
  MGDB_Core.findOne(
    mongoURI,
    config.get('database.player_accounts'),
    { username: usrname },
    filter
  );

// Fetch all users in the database
const fetchUsers = (filter = null) =>
  MGDB_Core.find(mongoURI, config.get('database.player_accounts'), {}, filter);

module.exports = { createUser, fetchUser, fetchUsers };
