// This will be our application entry. We'll setup our server here.
const http = require('http');
const app = require('./src/app');

const port = parseInt(process.env.PORT, 10) || 8005;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);