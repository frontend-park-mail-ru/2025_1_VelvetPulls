'use strict';

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = 8081;
const hostname = 'localhost';

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, '..', 'public')));
app.use(express.static(path.resolve(__dirname, '..', 'node_modules')));
app.use(express.static(path.resolve(__dirname, 'images')));

app.get('/login', (req, res) => {
    res.send('Hello World')
});
  
app.get('/signup', (req, res) => {
  res.send('Hello World!!!')
});

app.listen(port, hostname, () => {
  console.log(`Server is running on http://${hostname}:${port}/`);
});