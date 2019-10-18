const SerialPort = require('serialport')
const Readline = SerialPort.parsers.Readline

console.log("parameter to serialchild: "+process.argv[2]);

try{
	const port = new SerialPort(process.argv[2])
	const parser = new Readline()
    port.pipe(parser)
	parser.on('data', function (data) {
      console.log('child says: '+ data)
      if (process.send) {
	    process.send(data)
      }
    })
} catch(error) {
	console.log("error in SerialPort communication: "+error);
	process.exit();
}

//this fires in case the given path to the serial port does not exist
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
  process.exit();
});



process.on('message', message => {
  console.log('message from parent:', message);
});