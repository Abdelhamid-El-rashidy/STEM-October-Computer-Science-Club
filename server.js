const jsonServer = require('json-server');
const server = jsonServer.create();
const router1 = jsonServer.router('database/articles.json');
const router2 = jsonServer.router('database/projects.json');
const middlewares = jsonServer.defaults();

const PORT_ARTICLES = process.env.PORT_ARTICLES || 3001;
const PORT_PROJECTS = process.env.PORT_PROJECTS || 3002;

// Serve static files
server.use(jsonServer.static('public'));

server.use('/articles', router1);
server.use('/projects', router2);
server.use(middlewares);

server.listen(PORT_ARTICLES, () => {
  console.log(`JSON Server (Articles) is running on port ${PORT_ARTICLES}`);
});

server.listen(PORT_PROJECTS, () => {
  console.log(`JSON Server (Projects) is running on port ${PORT_PROJECTS}`);
});
