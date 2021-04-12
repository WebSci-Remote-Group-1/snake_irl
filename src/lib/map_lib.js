/*
 * Functions responsible for managing interactions between the API and updating
 * the map collection(s) in the MongoDB database
 */

// Package imports
const config = require('config');
const { ObjectID } = require('mongodb');

// Homebrew imports
const MGDB_Core = require('./mongo_lib');

// Globals
const mongoURI = MGDB_Core.constructProperMongoURI('MGDB_MAPMANAGER');

/*
 * =======================================
 * Functions
 * =======================================
 */

// Takes in user details and creates the user on mongoDB
const createMap = async (mapDetails) => {
  console.log(mongoURI);
};

// Fetch user with username == usrname from db, optionally query can be filtered
const fetchMap = (mapID, filter = null) =>
  MGDB_Core.findOne(mongoURI, 'maps', { _id: new ObjectID(mapID) }, filter);

// Fetch all users in the database
const fetchMaps = (query = null, filter = null) =>
  MGDB_Core.find(mongoURI, 'maps', query, filter);

module.exports = { createMap, fetchMap, fetchMaps };
