const jsonServer = require('json-server');
const express = require('express');

const server = jsonServer.create();
const router = jsonServer.router('database/db.json');
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3001;

server.use(express.static('public'));

// Routes for public pages
server.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

server.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

// Routes for pages inside the 'pages' directory
server.get('/pages/articles', (req, res) => {
  res.sendFile(__dirname + '/public/pages/articles.html');
});

server.get('/pages/projects', (req, res) => {
  res.sendFile(__dirname + '/public/pages/projects.html');
});

// Routes for pages inside the 'pages/tracks' directory
server.get('/pages/tracks/Alg&DS', (req, res) => {
  res.sendFile(__dirname + '/public/pages/tracks/Alg&DS.html');
});

server.get('/pages/tracks/app-development', (req, res) => {
  res.sendFile(__dirname + '/public/pages/tracks/app-development.html');
});

server.get('/pages/tracks/machine-learning', (req, res) => {
  res.sendFile(__dirname + '/public/pages/tracks/machine-learning.html');
});

server.get('/pages/tracks/programming-fundmentals', (req, res) => {
  res.sendFile(__dirname + '/public/pages/tracks/programming-fundmentals.html');
});

server.get('/pages/tracks/Robotics', (req, res) => {
  res.sendFile(__dirname + '/public/pages/tracks/Robotics.html');
});

server.get('/pages/tracks/web-development', (req, res) => {
  res.sendFile(__dirname + '/public/pages/tracks/web-development.html');
});

// API routes (if needed) - based on your existing configuration
server.use('/api', router);
server.use(middlewares);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
