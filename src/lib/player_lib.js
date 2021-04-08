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
const createUser = async (userDetails) => {
  console.log(mongoURI);
};

const fetchUser = (usrname, filter = null) =>
  new Promise((resolve, reject) => {
    MGDB_Core.fetchMongoConnection(mongoURI)
      .then((connection) => {
        return connection
          .db('snake_irl')
          .collection(config.get('database.player_accounts'))
          .findOne({ username: usrname }, filter);
      })
      .then((results) => {
        results == null
          ? reject(`${usrname} is not a known user of snake_irl`)
          : resolve(results);
      });
  });

const fetchUsers = (filter = null) =>
  new Promise((resolve, reject) => {
    MGDB_Core.fetchMongoConnection(mongoURI)
      .then((connection) => {
        return connection
          .db('snake_irl')
          .collection(config.get('database.player_accounts'))
          .find({}, filter);
      })
      .then((results) => {
        results.toArray((err, data) => {
          err ? reject(err) : resolve(data);
        });
      });
  });

module.exports = { createUser, fetchUser, fetchUsers };
