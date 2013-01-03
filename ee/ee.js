(function(){'use strict';

function Emitter() {
  this.callbacks = {}
}

Emitter.prototype.on = function(event, fn){
  (this.callbacks[event] = this.callbacks[event] || [])
    .push(fn)
  return this
};


Emitter.prototype.once = function(event, fn){
  var self = this
  function on() {
    self.off(event, on)
    fn.apply(this, arguments)
  }

  this.on(event, on)
  return this
}

Emitter.prototype.off = function(event, fn){
  var callbacks = this.callbacks[event]
  if (!callbacks) return this

  if (1 == arguments.length) {
    delete this.callbacks[event]
    return this
  }

  var i = callbacks.indexOf(fn)
  callbacks.splice(i, 1)
  return this
}


Emitter.prototype.emit = function(event){
  var args = [].slice.call(arguments, 1)
    , callbacks = this.callbacks[event]

  if (callbacks) {
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args)
    }
  }

  return this
}
})
