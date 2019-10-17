const express = require('express');
const app = express();

var http = require('http').createServer(app);
var io = require('socket.io')(http);


const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline
//const port = new SerialPort(path)
const port = new SerialPort('/dev/ttyACM0')
const parser = new Readline()
port.pipe(parser)

parser.on('data', function (data) {
  console.log('Data:', data)
  io.emit('data', data)
})

app.use(express.static('res'));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

