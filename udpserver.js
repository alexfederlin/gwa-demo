var PORT = 12345;
var HOST = '172.20.10.6';

var lasttime = Date.now();
var diff = 0;
var dgram = require('dgram');
var server = dgram.createSocket('udp4');
var jspack = require('jspack').jspack;
var buff;
var out; 

server.on('listening', function() {
  var address = server.address();
  var srvmsg= 'UDP Server listening on ' + address.address + ':' + address.port;
  console.log(srvmsg)
  if (process.send) {
    process.send(srvmsg);
  }
});

server.on('message', function(message, remote) {
  diff = Date.now()-lasttime;
  //lasttime = Date.now();
  buff = jspack.Unpack('<iii',message);
  out = buff[0]+', '+ buff[1]+', '+ buff[2];
  //console.log(out);
  if (process.send) {
	process.send(out)
  }
	  //console.log(remote.address + ':' + remote.port +' - ' + diff+' - ' + message + ' - ' + buff );
});


server.bind(PORT, HOST);
