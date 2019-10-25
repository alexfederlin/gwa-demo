const path = require('path');
const express = require('express');
const app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fork = require('child_process').fork;

var msgcounter=0;

//const serialchildfile = path.resolve('serialchild.js');
const udpchildfile = path.resolve('udpserver.js');
const btchildfile = path.resolve('btchild.js');

const serialport = '/dev/ttyACM0'

const parameters = [serialport];
const options = {
  stdio: [ 'pipe', 'pipe', 'pipe', 'ipc' ]
};

console.log("forking children");

//const serialchild = fork(serialchildfile, parameters, options);
const btchild = fork(btchildfile, [], options);
const udpchild = fork(udpchildfile, [], options);

//setupChild(serialchild);
setupChild(btchild);
setupChild(udpchild);


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

setInterval(function(){
	console.log (msgcounter + " messages sent during the last 10s. That's one message every "+Math.floor((10/msgcounter)*1000)+"ms");
	msgcounter=0;
	
}, 10000)

function setupChild(child){
	child.on('message', message => {
	  //console.log('message from child:', message);
	  msgcounter++;
	  io.emit('data', message)
	});

	child.on('error', (err) => {
	  console.log(`child process encountered error: ${err}`);
	});
	
	child.on('exit', (code) => {
    console.log(`child process exited with code ${code}`);
});
}