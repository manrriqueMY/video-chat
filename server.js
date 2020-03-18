const credentials = require('./credentials');
const express = require('express');
const app = express();
let server;

const POST = process.env.POST || 3000;

if (credentials.key && credentials.cert) {
  const https = require('https');
  server = https.createServer(credentials, app);
  //POST = 443;
} else {
  const http = require('http');
  server = http.createServer(app);
  //POST = 3000;
}
const io = require('socket.io')(server);
const RoomService = require('./RoomService')(io);

io.sockets.on('connection', RoomService.listen);
io.sockets.on('error', e => console.log(e));

app.use(express.static(__dirname + '/public'));

app.get('*', function(req, res) {
    res.sendFile(`${__dirname}/public/index.html`);
});
server.listen(POST, () => console.log(`Server is running on POST ${POST}`));
