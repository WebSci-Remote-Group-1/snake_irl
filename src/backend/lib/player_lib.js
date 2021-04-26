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
const createUser = (userDetails) =>
  new Promise((resolve, reject) => {
    const userDoc = {
      ...userDetails,
      history: [],
      access_level: 0,
      points: 0,
      totalPlaytime: 0,
      friends: [],
      lastLogin: new Date(),
      maps: {
        favoriteMaps: [],
        createdMaps: [],
      },
      socialMedia: [],
    };
    MGDB_Core.insertOne(
      mongoURI,
      config.get('database.player_accounts'),
      userDoc
    ).then((resp) => {
      console.log(resp);
      resolve(resp.insertedCount !== 0);
    });
  });

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

const userExists = (username) =>
  new Promise((resolve) => {
    fetchUser(username)
      .then((resp) => {
        resp === null || resp === undefined || resp.length === 0
          ? resolve(false)
          : resolve(true);
      })
      .catch((err) => {
        console.error(err);
        resolve(false);
      });
  });

const userLogin = (username) =>
  new Promise((resolve, reject) => {
    MGDB_Core.updateOne(
      mongoURI,
      config.get('database.player_accounts'),
      { username: username },
      { $set: { lastLogin: new Date() } }
    )
      .then((resp) => resolve(resp))
      .catch((err) => {
        console.error(err);
        reject(err);
      });
  });

module.exports = { createUser, fetchUser, fetchUsers, userExists, userLogin };
