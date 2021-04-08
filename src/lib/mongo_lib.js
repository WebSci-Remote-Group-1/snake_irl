/*
 * Functions responsible for negotiating interactions between the express API
 * server and the MongoDB database
 */

const mongodb = require('mongodb');
require('dotenv').config();

/*
 * =======================================
 * Functions
 * =======================================
 */
const constructProperMongoURI = (env_var_name) => {
  let uri =
    'mongodb+srv://' + process.env[env_var_name] + '@' + process.env.MONGO_URI;

  return uri;
};

module.exports = { constructProperMongoURI };
