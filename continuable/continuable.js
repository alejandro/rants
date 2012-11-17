"use strict";

var Continuable = {}

Continuable.make = function make(fn) {
  if ('function' !== typeof(fn)) throw new Error(fn + 'is not a function')
  var evnt;
  function first() {
    var args = [].slice.call(arguments)
    
    return function callback(ok, bad) {
      if (evnt) bad = evnt
      else bad = function (err){ console.error(err.stack + '\n') }

      args.push(function (err, fine){
        if (err) return bad(err)
        ok(fine)
      })
      return fn.apply(fn, args)
    }

  }
  first.on = function (ev, dow) { if ('error' === ev) evnt = dow }
  return first
}

Continuable.convert = function each(obj, things){
  if (typeof(obj) === 'object' && Array.isArray(obj)) {
    return obj.map(Continuable.makeObject)
  }
  if (!things) things = []
  var fixed = {}, val
  
  for (var key in obj) {
    if (obj.hasOwnProperty(key) && ~things.indexOf(key)){
      val = obj[key]
      if (typeof(val) === 'function') {
        fixed[key] = Continuable.make(val)
      } else {
        fixed[key] = val
      }
    } else fixed[key] = obj[key]
  }
  return fixed
}

module.exports = Continuable
