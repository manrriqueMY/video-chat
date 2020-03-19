const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 3000;

const MAX_CLIENTS = 3;

io.on('connection', function(socket){
  const rooms = io.nsps['/'].adapter.rooms;
  socket.on('join', function(room) {
    let numClients = 0;
    if (rooms[room]) {
      numClients = rooms[room].length;
    }
    if (numClients < MAX_CLIENTS) {
      socket.on('ready', function() {
        socket.broadcast.to(room).emit('ready', socket.id);
      });
      socket.on('offer', function (id, message) {
        socket.to(id).emit('offer', socket.id, message);
      });
      socket.on('answer', function (id, message) {
        socket.to(id).emit('answer', socket.id, message);
      });
      socket.on('candidate', function (id, message) {
        socket.to(id).emit('candidate', socket.id, message);
      });
      socket.on('disconnect', function() {
        socket.broadcast.to(room).emit('bye', socket.id);
      });
      socket.join(room);
    } else {
      socket.emit('full', room);
    }
  });
});
io.on('error', e => console.log(e));

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendFile(__dirname+"/public/index.html");
});

server.listen(PORT, () => {console.log("Server is running on PORT "+PORT);});