const jsonServer = require('json-server');
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = jsonServer.create();
const router1 = jsonServer.router('database/articles.json');
const router2 = jsonServer.router('database/projects.json');
const middlewares = jsonServer.defaults();

const PORT_ARTICLES = process.env.PORT_ARTICLES || 3001;
const PORT_PROJECTS = process.env.PORT_PROJECTS || 3002;

server.use('/articles', router1);
server.use('/projects', router2);

server.use(middlewares);

// Create a basic HTTP server
const httpServer = http.createServer((req, res) => {
  // Serve static files
  const filePath = path.join(__dirname, 'public', req.url);
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

httpServer.listen(PORT_ARTICLES, () => {
  console.log(`JSON Server (Articles) is running on port ${PORT_ARTICLES}`);
});

httpServer.listen(PORT_PROJECTS, () => {
  console.log(`JSON Server (Projects) is running on port ${PORT_PROJECTS}`);
});
