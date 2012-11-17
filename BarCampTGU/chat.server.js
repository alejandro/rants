var net = require('net'), sockets = {}, server

Object.defineProperty(global, 'socks', {
    get: function () {
        return Object.keys(sockets)
    }
})

server = net.createServer(function (sock){
    sock.id = +new Date, sockets[sock.id] = sock

    sock.write('Bienvenido, actualmente conectados ' +  socks.length + ' clientes')
    sock.on('data', writeLn)
    sock.on('close', close)

    function writeLn(line) {
        line = line.toString()
        socks.forEach(function (sk){
            sk = sockets[sk]
            if (sk.id !== sock.id) sk.write(sock.id + ': ' + line)
        })
    }
    function close() {
        delete sockets[sock.id]
        try { sock.destroy() } catch (ex){}
    }
})

server.listen(9001, function (){
    console.log('[*] Chat server en %d', this.address().port)
})