/*
 * Functions responsible for negotiating interactions between the express API
 * server and the MongoDB database
 */

const { MongoClient, ObjectID } = require('mongodb');
require('dotenv').config();

/*
 * =======================================
 * Functions
 * =======================================
 */

/* Returns the proper mongoURI given the name of the env var which stores the
 * username and password of the user to authenticate on the database in the
 * format <username>:<password>
 */
const constructProperMongoURI = (env_var_name) => {
  let uri =
    'mongodb+srv://' + process.env[env_var_name] + '@' + process.env.MONGO_URI;

  return uri;
};

// Instantiates and returns a mongoDB connection from a given URI
const fetchMongoConnection = async (mongoURI) => {
  const mongoClient = new MongoClient(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  let retObj = null;
  try {
    await mongoClient.connect();
    retObj = mongoClient;
  } finally {
    return retObj;
  }
};

module.exports = { constructProperMongoURI, fetchMongoConnection };
