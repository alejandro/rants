# Continuable

[Tim Caswell](https://github.com/creationix/) is proponing a ["continuable" style in luvit](https://github.com/luvit/continuable) (instead of raw callbacks).
This a silly attempt to make that same stuff in vanilla js.


## Use:

```javascript
var Continuable = require('./continuable')


function toContinuable(arg1, arg2 /*, argN*/, cb) {

  /* do expensive task*/
  setTimeout(function (){
    cb(null, arg1 + arg2)
  }, 1000)
}

/*
 * Instead of doing this:

    toContinuable('hello', ' world', function (err, res){
        if (err) return console.error(error)
        console.log(res)
    })    
*/


toContinuable = Continuable.make(toContinuable)

toContinuable('hello',' world')(function (res){
  console.log(res)
}, function (err){
  /* you can ignore this*/
})
```

Or also you can attach to an error event.

```javascript

toContinuable.on('error', function (err){
  console.log('Upsy!')  
})

toContinuable('hello', 'world')(function (res){
  console.log(res)
})
```


## License
MIT by Alejandro Morales
http://ale.mit-license.org/
