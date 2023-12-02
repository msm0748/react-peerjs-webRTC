const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const port = 8080;
const app = express();
app.use(cors);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

server.listen(port, () => {
  console.log(`Listening to the server on ${port}`);
});