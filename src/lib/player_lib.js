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
  new Promise((resolve, reject) => {
    MGDB_Core.fetchMongoConnection(mongoURI)
      .then((connection) => {
        // Fetch data from DB
        return connection
          .db('snake_irl')
          .collection(config.get('database.player_accounts'))
          .findOne({ username: usrname }, filter);
      })
      .then((results) => {
        // Parse and handle results of db lookup
        results == null
          ? reject(`${usrname} is not a known user of snake_irl`)
          : resolve(results);
      });
  });

// Fetch all users in the database
const fetchUsers = (filter = null) =>
  new Promise((resolve, reject) => {
    MGDB_Core.fetchMongoConnection(mongoURI)
      .then((connection) => {
        // Fetch data from DB
        return connection
          .db('snake_irl')
          .collection(config.get('database.player_accounts'))
          .find({}, filter);
      })
      .then((results) => {
        // Parse and handle results of db lookup
        results.toArray((err, data) => {
          err ? reject(err) : resolve(data);
        });
      });
  });

module.exports = { createUser, fetchUser, fetchUsers };
