/*
 * Functions responsible for managing interactions between the API and updating
 * the map collection(s) in the MongoDB database
 */

// Package imports
const config = require('config');

// Homebrew imports
const MGDB_Core = require('./mongo_lib');

// Globals
const mongoURI = MGDB_Core.constructProperMongoURI('MGDB_MAPMANAGER');

/*
 * =======================================
 * Functions
 * =======================================
 */

// Takes in map details and creates the map on mongoDB
const createMap = async (mapDetails) => {
  // console.log(mongoURI);
  return MGDB_Core.insertOne(mongoURI, 'maps', mapDetails);
};

// Update map details
const updateMap = (mapID, mapOwner, mapDetails) => MGDB_Core.updateOne(mongoURI, 'maps', {_id: mapID, mapOwner}, {$set: mapDetails});

// Delete map
const deleteMap = (mapID, mapOwner) => MGDB_Core.deleteOne(mongoURI, 'maps', {_id: mapID, mapOwner});

// Fetch user with username == usrname from db, optionally query can be filtered
// Fetch map with mapID and filter
const fetchMap = (mapID, filter = null) =>
  MGDB_Core.findOne(mongoURI, 'maps', { _id: mapID }, filter);

// Fetch all maps in the database
const fetchMaps = (query = null, filter = null) =>
  MGDB_Core.find(mongoURI, 'maps', query, filter);

// Fetch map data from an array of ObjectIDs
const fetchMapsFromArray = maps => MGDB_Core.find(mongoURI, 'maps', {_id: {$in: maps}});

// Fetch map data from a user's auth token
const fetchMapsFromAuth = auth => MGDB_Core.find(mongoURI, 'maps', {mapOwner: auth});
module.exports = { createMap, updateMap, deleteMap, fetchMap, fetchMaps, fetchMapsFromArray, fetchMapsFromAuth };
