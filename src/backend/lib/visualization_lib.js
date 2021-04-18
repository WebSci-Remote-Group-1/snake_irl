/*
 * Functions responsible for performing ETL operations on Mongo data and performing visualizations
 */

// Package imports
const {
  Parser,
  transforms: { flatten },
} = require('json2csv');

// Homebrew imports
const MGDB_PlayerInterface = require('./player_lib');

// Globals

/*
 * =======================================
 * Functions
 * =======================================
 */

// Requests all users from DB with queryFilter applied, converts the result to
// csv and then returns the data
const serializeUsers = (queryFilter = null) =>
  new Promise((resolve, reject) => {
    const transforms = [flatten()];

    const json2csv = new Parser({ transforms });

    let returnData = null;

    MGDB_PlayerInterface.fetchUsers(queryFilter)
      .then((resp) => {
        returnData = json2csv.parse(resp);
      })
      .catch((err) => {
        reject(err);
      })
      .finally(() => {
        resolve(returnData);
      });
  });

module.exports = { serializeUsers };
