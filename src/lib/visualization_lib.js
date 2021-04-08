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
const serializeUsers = async (queryFilter = null) => {
  let userData = await MGDB_PlayerInterface.fetchUsers(queryFilter);

  const transforms = [flatten()];

  const json2csv = new Parser({ transforms });
  const csv_data = json2csv.parse(userData);
  return csv_data;
};

module.exports = { serializeUsers };
