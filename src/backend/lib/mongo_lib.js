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

  return mongoClient.connect();
};

const findOne = (mongoURI, collectionName, query, filter) =>
  new Promise((resolve, reject) => {
    fetchMongoConnection(mongoURI)
      .then((connection) => {
        // Fetch data from DB
        mongoClient = connection;
        return connection
          .db('snake_irl')
          .collection(collectionName)
          .findOne(query, filter);
      })
      .then((results) => {
        // Parse and handle results of db lookup
        mongoClient.close();
        results == null
          ? reject(`No results for provided query ${JSON.stringify(query)}`)
          : resolve(results);
      });
  });

const find = (mongoURI, collectionName, query, filter) =>
  new Promise((resolve, reject) => {
    fetchMongoConnection(mongoURI)
      .then((connection) => {
        // Fetch data from DB
        mongoClient = connection;
        return connection
          .db('snake_irl')
          .collection(collectionName)
          .find(query, filter);
      })
      .then((results) => {
        // Parse and handle results of db lookup
        results.toArray((err, data) => {
          mongoClient.close();
          err ? reject(err) : resolve(data);
        });
      });
  });

const updateInsertOne = (
  mongoURI,
  collectionName,
  query,
  updateDoc,
  options = { upsert: true }
) =>
  new Promise((resolve, reject) => {
    fetchMongoConnection(mongoURI)
      .then((connection) => {
        mongoClient = connection;
        return mongoClient
          .db('snake_irl')
          .collection(collectionName)
          .updateOne(query, updateDoc, options);
      })
      .then((response) => {
        mongoClient.close();
        response
          ? resolve({ status: 0, message: 'Update/Insert operation completed' })
          : reject({
              status: -1,
              message: 'ERROR: Could not update or insert',
            });
      });
  });

module.exports = {
  constructProperMongoURI,
  fetchMongoConnection,
  findOne,
  find,
  updateInsertOne,
};
