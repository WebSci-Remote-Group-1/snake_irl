const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const dotenv = require('dotenv').config();

const app = express();
const port = 3001;
const api_path = '/api/v1';

const constructProperMongoURI = (env_var_name) => {
  let uri =
    'mongodb+srv://' + process.env[env_var_name] + '@' + process.env.MONGO_URI;

  return uri;
};

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
  console.log(constructProperMongoURI('MGDB_PLAYERMANAGER'));
});

app.get(api_path + '/hello', (req, res) => {
  res.json({ status: 200, message: 'Hello world!' });
});

app.get(api_path + '/player/:id', (req, res) => {
  console.log(req.params.id);
  res.json({ status: 200, message: 'You are pinging the players endpoint' });
});
