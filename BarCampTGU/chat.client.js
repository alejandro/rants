var net = require('net')

var socket = net.createConnection(9001)

socket.on('data', function (dat){ console.log(dat.toString())})

var stdin = process.openStdin()

stdin.on('data', function (dat){
    socket.write(dat.toString())
    process.stdout.write('\n:>')
})
