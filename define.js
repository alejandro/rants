/**
 * Require: A dummy implementation of Require
 * -------------------------
 * @author: Alejandro Morales <vamg008@gmail.com>
 * @license: MIT 2012 <http://ale.mit-license.org>
 * @date: date
 *//*jshint browser:true */

!function(exports){'use strict';

  var modules = {}, config = {}
  
  exports.define = function define(name, def){
    if ('function' !== typeof(def)) modules[name] = def
    try { 
      modules[name] = def()
    } catch (ex) { console.error('[ERROR]', ex.stack) }
  }

  function require(name){
     if (!modules[name]) throw new Error(name + ' is not defined')
      return modules[name]
  }
  
  require.config = function (cfg){
    cfg = config
  }

  require.load =  function (url, id, sync){
    if ('object' === typeof(id)) {
      url = id.url
      sync = id.sync
      id = id.id
    }
    if (modules[id]) return modules[id]
    var cb = [].slice.call(arguments, -1)
      , script = document.createElement('script')

    script.setAttribute('data-module', id)
    script.type = config.scriptType || 'text/javascript'
    script.charset = 'utf-8'

    script.addEventListener('load', function (){
      if (typeof(cb) === 'function') cb()
      console.log('[require] ' + id + ' loaded')
    }, false)
    script.addEventListener('error', function (){})
    
    if (sync) script.async =  sync
    script.src = url
    document.head.appendChild(script)
    return require
  }

  exports.require = require


}(typeof(exports) !== 'undefined' ? exports : window)
