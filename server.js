const express = require('express');
const app = express();

const POST = process.env.POST || 3000;
const http = require('http');
const server = http.createServer(app);

const io = require('socket.io')(server);
const RoomService = require('./RoomService')(io);

io.sockets.on('connection', RoomService.listen);
io.sockets.on('error', e => console.log(e));

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendFile(`${__dirname}/public/index.html`);
});
server.listen(POST, () => console.log(`Server is running on POST ${POST}`));

/*

    "express": "^4.17.1",
    "socket.io": "1.4.*"

    dev

    "@types/node": "^8.0.10",
    "@types/socket.io-client": "^1.4.29",
    "@types/webrtc": "0.0.21",
    "eslint": "^4.2.0"

*/
