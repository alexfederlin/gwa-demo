import socket
import struct
import time
# set up the socket using local address
socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
socket.bind(("", 12345))

lasttime = time.time()

while 1:

    # get the data sent to us
    data, ip = socket.recvfrom(1024)


    values=struct.unpack ('iii', data)
    #print("values: ", values)
    #print values
    secondsSinceEpoch = time.time()
    #secondsSinceEpoch = time.time() -lasttime
    #lasttime = time.time()
    print str(secondsSinceEpoch) +" " +  str(values)