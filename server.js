const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const io = require('socket.io')(server);
const RoomService = require('./RoomService')(io);
io.sockets.on('connection', RoomService.listen);
io.sockets.on('error', e => console.log(e));

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendFile(__dirname+"/public/index.html");
});

server.listen(PORT, () => {console.log("Server is running on PORT "+PORT);});