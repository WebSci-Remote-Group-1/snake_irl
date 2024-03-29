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

// MGDB Object
const ObjectID = require('mongodb').ObjectID;

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
      bio: "",
      privacy: {
        showCreated: true,
        showFavorites: true,
      },
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

// Updates a user's account data that they can edit
const updateUserData = (userDetails) => 
  new Promise((resolve, reject) => {
    const updateDoc = {
      "$set": {
        "demographics.homebase.lat": userDetails.lat,
        "demographics.homebase.long": userDetails.long,
        "bio": userDetails.bio,
        "privacy": userDetails.privacy,
      },
    };
    const queryDoc = {
      "_id": new ObjectID(userDetails.id),
    };
    MGDB_Core.updateOne(
      mongoURI,
      config.get('database.player_accounts'),
      queryDoc,
      updateDoc
    ).then((resp) => {
      console.log(resp);
      resolve(resp);
    }).catch((err) => {
      reject(err);
    });
  });

// Update a user's password
const updateUserPassword = (userDetails) => 
  new Promise((resolve, reject) => {
    const updateDoc = {
      "$set": {
        "password": userDetails.password,
      },
    };
    const queryDoc = {
      "_id": new ObjectID(userDetails.id),
    };
    MGDB_Core.updateOne(
      mongoURI,
      config.get('database.player_accounts'),
      queryDoc,
      updateDoc
    ).then((resp) => {
      console.log(resp);
      resolve(resp);
    }).catch((err) => {
      reject(err);
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

const updateUserTime = (updateTimeObj) =>
  new Promise((resolve, reject) => {
    fetchUser(updateTimeObj.username).then((resp) => {
      resp === null || resp === undefined || resp.length === 0
        ? reject('No such user')
        : () => {
            oldTime = resp.totalPlaytime;
            newTime = oldTime + updateTimeObj.time;
            MGDB_Core.updateOne(
              mongoURI,
              config.get('database.player_accounts'),
              { username: updateTimeObj.username },
              { $set: { totalPlaytime: newTime } }
            )
              .then((resp) => resolve(resp))
              .catch((err) => {
                console.error(err);
                reject(err);
              });
          };
    });
  });

const fetchUserByAuth = (auth) =>
  MGDB_Core.findOne(mongoURI, config.get('database.player_accounts'), {
    _id: new ObjectID(auth),
  });

const fetchLeaderboard = ( username ) => 
	MGDB_Core.find( mongoURI, config.get('database.player_accounts'), {}, {projection: {demographics: 0, socialMedia: 0, maps: 0, password: 0}}, { points: -1 }, 10 );

const addMapToUser = (auth, mapID) => MGDB_Core.updateOne(mongoURI, config.get('database.player_accounts'), {_id: auth}, {$push: {"maps.createdMaps": mapID}});

const removeMapFromUser = (auth, mapID) => MGDB_Core.updateOne(mongoURI, config.get('database.player_accounts'), {_id: auth}, {$pull: {"maps.createdMaps": mapID}});
module.exports = {
  createUser,
  updateUserData,
  updateUserPassword,
  fetchUser,
  fetchUsers,
  userExists,
  userLogin,
  fetchUserByAuth,
  updateUserTime,
	fetchLeaderboard,
  addMapToUser,
  removeMapFromUser,
};
