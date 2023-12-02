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

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);
    console.log(roomId, userId);
  });

  socket.on('disconnect', () => {
    console.log('user is disconnected');
  });
});

server.listen(port, () => {
  console.log(`Listening to the server on ${port}`);
});
