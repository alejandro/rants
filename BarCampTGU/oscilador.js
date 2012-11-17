/*jshint browser:true, nonstandard:true */
/*
 * Author: Alejandro Morales
 * license: WTFPL
 */

!function Oscillator(exports){"use strict";

var body      = $('body')
  , dropZone  = $('#drop_area')
  , oscilador = $('#oscilador')
  , list      = $('#list')
  , volumen   = $('#volumen')

dropZone.addEventListener('dragover', dragOver, false)
dropZone.addEventListener('drop', fileDrop, false)

if (!exports.AudioContext && exports.webkitAudioContext) {
  exports.AudioContext = exports.webkitAudioContext
} else {
  body.innerHTML = '<strong> Tu navegador no tiene soporte para AudioContext </strong>'
}

function $(el){
  return document.querySelector(el)
}

function dragOver(ev) {
  ev.stopPropagation()
  ev.preventDefault()
  ev.dataTransfer.dropEffect = 'copy'
}

function clearCanvas() {
  body.removeAttribute('class')
  oscilador.innerHTML = ''
}

function fileDrop(ev) {
  ev.stopPropagation()
  ev.preventDefault()
  clearCanvas()

  var files = ev.dataTransfer.files
    , output = []
    , file = files[0]
    , i = 0
    , f

  for (; f = files[i]; i++) {
    if (!f.type.match('audio.*')) {
        continue;
    }

    output.push(
      '<li data-name="'+ f.name +'" id="song">',
      '<strong>', escape(f.name), '</strong> (',
      f.type || 'n/a', ') - ', f.size, ' bytes, Última modificación: ',
      f.lastModifiedDate.toLocaleDateString(), '</li>'
    )
  }

  list.innerHTML = '<ul>' + output.join('') + '</ul>'

  var reader = new FileReader
  
  // TODO: Rethink this
  reader.onload = (function() {
    return function (){
      var span = document.createElement('span')
      span.innerHTML = ['---'].join('')
      list.insertBefore(span, null)
    }
  })(file)

  reader.onloadend = function (){
    loadMusic.apply(reader, arguments)
  }
  
  exports.file = file
  // stop the current song if there is any
  if (exports.current) exports.current.noteOff(0)
  reader.readAsArrayBuffer(file)
}

function loadMusic() {
  /*jshint validthis:true */
  if (!this.result) return console.error('no file')

  var context      = new AudioContext
    , Osciloscopio = new WavyJones(context, 'oscilador')
    , gainNode     = context.createGainNode()
    , song         = null

  volumen.addEventListener('change', function () {
    gainNode.gain.value = this.value
  })
  
  context.decodeAudioData(this.result, function (buffer){
    playSound(song = buffer)
  }, function (err){
    console.log(err)
  })

  function playSound(buffer) {
    var source = context.createBufferSource()
    source.buffer = buffer
    // this is silly, but still awesome!
    source.connect(gainNode)
    gainNode.connect(Osciloscopio)
    Osciloscopio.connect(context.destination)

    // play!  
    source.noteOn(0)
    exports.current = source

    body.setAttribute('class', 'playing')
    $('#song').innerHTML = '<strong>Ahora reproduciendo ' + exports.file.name + '</strong>'
  }
}

function WavyJones(context, elem) {
  /* Author: Stuart Memo <http://stuartmemo.com/wavy-jones/>
   * Adapted by: Alejandro Morales <@_alejandromg>
   */
  var analyser = context.createAnalyser()
    , el = $('#' + elem)

  analyser.width = el.offsetWidth
  analyser.height = el.offsetHeight
  analyser.lineColor = 'red'
  analyser.lineThickness = 5

  var paper = Raphael(elem, analyser.width, analyser.height)
    , oscLine = paper.path([
        ['M', 0, analyser.height/2],
        ['L', analyser.width, analyser.height/2],
        'Z'
      ])
    , freqData = new Uint8Array(analyser.frequencyBinCount)
    , noDataPoints = 10

  oscLine.attr({
    stroke: analyser.lineColor,
    'stroke-width': analyser.lineThickness
  })

  function drawLine() {
    analyser.getByteTimeDomainData(freqData)

    var graphPoints = []
      , graphStr = ''

    graphPoints.push('M0, ' + (analyser.height/2))

    for (var i = 0; i < freqData.length; i++) {
      if (i % noDataPoints) {
        var point = (freqData[i] / 128) * (analyser.height / 2)
        graphPoints.push('L' + i + ', ' + point)
      }
    }

    for (i = 0; i < graphPoints.length; i++) {
      graphStr += graphPoints[i]
    }

    oscLine.attr('stroke', analyser.lineColor)
    oscLine.attr('stroke-width', analyser.lineThickness)
    oscLine.attr('path', graphStr)

    setTimeout(drawLine, 100)
  }

  drawLine()
  return analyser
}

}(window)