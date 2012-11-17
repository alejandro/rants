var Continuable = require('./continuable')
  , assert = require('assert')
  , fs = Continuable.convert(require('fs'), ['readFile'])



function queryServer(query, db, cb) {
  setTimeout(function (){
    cb(new Error('kas'), 'okasda:' + query + ':' + db)
  }, 1000)
}

queryServer = Continuable.make(queryServer)

queryServer.on('error', function() {
  console.log('<errror></errror>')
})
queryServer('lolcats', 'gif')(function (dt){
  console.log('dt',dt)
})
  
