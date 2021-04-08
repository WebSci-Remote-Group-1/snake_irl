const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const dotenv = require('dotenv').config();

const app = express();
const port = 3001;
const api_path = '/api/v1';

const mongoClient = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

app.get(api_path + '/player/:id', (req, res) => {
  res.json({ status: 200, message: 'You are pinging the players endpoint' });
});
