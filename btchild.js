var noble = require('@abandonware/noble');


const XDKServiceUuid = 'b9e875c01cfa11e6b7970002a5d5c51b';
const writeCharacteristicUuid = '0c68d100266f11e6b3880002a5d5c51b';
const notifyCharacteristicUuid = '1ed9e2c0266f11e6850b0002a5d5c51b';

const startMsg = Buffer.from("7374617274", "hex")
const stopMsg = Buffer.from("656e64", "hex")

var lasttime = Date.now()

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    //
    // Once the BLE radio has been powered on, it is possible
    // to begin scanning for services. Pass an empty array to
    // scan for all services (uses more time and power).
    //
    console.log('scanning for XDK...');
    noble.startScanning([XDKServiceUuid], false);
  }
  else {
    noble.stopScanning();
  }
})

var XDKService = null;
var writeCharacteristic = null;
var notifyCharacteristic = null;

noble.on('discover', function(peripheral) {
  // we found a peripheral, stop scanning
  noble.stopScanning();

  //
  // The advertisment data contains a name, power level (if available),
  // certain advertised service uuids, as well as manufacturer data,
  // which could be formatted as an iBeacon.
  //
  console.log('found peripheral:', peripheral.advertisement);
  peripheral.once('disconnect', function(){
	console.log("XDK disconnected. Restarting scanning.");
	XDKService = null;
    writeCharacteristic = null;
    notifyCharacteristic = null;
    noble.startScanning([XDKServiceUuid], false);
  });

  //
  // Once the peripheral has been discovered, then connect to it.
  //
  peripheral.connect(function(err) {
    //
    // Once the peripheral has been connected, then discover the
    // services and characteristics of interest.
    //
    peripheral.discoverServices([XDKServiceUuid], function(err, services) {
      services.forEach(function(service) {
        //
        // This must be the service we were looking for.
        //
        console.log('found service:', service.uuid);

        //
        // So, discover its characteristics.
        //
        service.discoverCharacteristics([], function(err, characteristics) {

          characteristics.forEach(function(characteristic) {
            //
            // Loop through each characteristic and match them to the
            // UUIDs that we know about.
            //
            console.log('found characteristic:', characteristic.uuid);

            if (writeCharacteristicUuid == characteristic.uuid) {
              writeCharacteristic = characteristic;
            }
            else if (notifyCharacteristicUuid == characteristic.uuid) {
              notifyCharacteristic = characteristic;
            }
          })

          //
          // Check to see if we found all of our characteristics.
          //
          if (writeCharacteristic &&
              notifyCharacteristic) {
            //
            // We did, so start streaming!
            //
            console.log("subscribe to notifications")
            notifyCharacteristic.subscribe(function(err){console.log("error subscribing to notifications: "+err)})
            notifyCharacteristic.on('data', function(data, isNotification){
              var diff = Date.now()-lasttime
              lasttime = Date.now()
			  datastring=data.toString().split(' ').join();
              console.log(diff+" : "+datastring);
			  // send to parent process
			  if (process.send) {
				process.send(datastring)
			  }
            });
            console.log("commence streaming");
            write(startMsg);
          }
          else {
            console.log('missing characteristics');
          }
        })
      })
    })
  })
})



function write(msg){

  writeCharacteristic.write(msg, false, function(err) {
    if (!err) {
		console.log("write successful")
	} else{
		console.log("error: "+err);
	}
  });
}


