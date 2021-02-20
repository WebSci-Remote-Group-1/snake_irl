const express = require('express');
const app = express();
const port = 3000;
app.use(express.json()); // JSON extraction (body-parsing)
app.use(express.static(__dirname + '/public')); // setup static folder

app.listen(port, () => {
  console.log('Listening on *:3000');
});
