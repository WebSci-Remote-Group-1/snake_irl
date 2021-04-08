/*
 * Functions responsible for managing interactions between the API and updating
 * the player collection(s) in the MongoDB database
 */

// Package imports
require('dotenv').config();

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
  console.log('This is imported from another function');
  console.log(mongoURI);
};

module.exports = { createUser };
