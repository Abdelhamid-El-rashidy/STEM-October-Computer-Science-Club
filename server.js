const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('database/db.json');
const middlewares = jsonServer.defaults();

const PORT = process.env.PORT || 3001;

server.use(jsonServer.static('public'));
server.use('/api', router);
server.use(middlewares);

server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});