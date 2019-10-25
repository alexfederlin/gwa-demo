var PORT = 12345;
var HOST = '172.20.10.6';

var lasttime = Date.now();
var diff = 0;
var dgram = require('dgram');
var server = dgram.createSocket('udp4');

function hex_to_ascii(str1)
 {
	var hex  = str1.toString();
	console.log("hex: "+hex);
	var str = '';
	for (var n = 0; n < hex.length; n += 2) {
		str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
	}
	console.log("string: "+str);
	return str;
 }

server.on('listening', function() {
  var address = server.address();
 console.log('UDP Server listening on ' + address.address + ':' + address.port);
});

server.on('message', function(message, remote) {
  diff = Date.now()-lasttime;
  lasttime = Date.now();
 //console.log(remote.address + ':' + remote.port +' - ' + hex_to_ascii(message));
 console.log(remote.address + ':' + remote.port +' - ' + diff);
});

server.bind(PORT, HOST);