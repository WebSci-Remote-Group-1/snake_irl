const express = require('express');
var sassMiddleware = require('node-sass-middleware');
var path = require('path');
const app = express();
const port = 3000;
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'assets/sass'),
    dest: path.join(__dirname, 'public/assets'),
    debug: true,
    outputStyle: 'compressed',
    prefix: '/assets',
  })
);
app.use(express.json()); // JSON extraction (body-parsing)
app.use('/', express.static(path.join(__dirname, 'public'))); // setup static folder
app.use(
  '/js',
  express.static(path.join(__dirname, 'node_modules/bootstrap/dist'))
); // Configure bootstrap support

app.listen(port, () => {
  console.log('Listening on *:3000');
});
