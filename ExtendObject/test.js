var ExtendObject = require('./')
var test = require('tap').test
var assert = require('assert')

var tmp = ExtendObject.create({separator: ':'})
tmp.mixin({
  'structure:hard': {
    a: 1, b: 2, c: 3
  },
  'structure:normal':{
    a: 0, b: 1, c: 2
  }
})


test('test new object tools', function (t){
  t.equal(tmp.has('separator'), false, 'options should not be public')
  t.ok(tmp.set('val', 'val'), 'insertion in tmp should be ok')
  t.equal(tmp.get('val'), 'val', 'get should be working')

  t.equal(tmp.get('structure:hard').a, 1, 'deep linking should works')
  t.equal(tmp.structure.hard.a, 1,'default access should be working')
  t.equal(tmp.has('structure:normal'), true, 'structure:normal should be already set')
  t.notOk(tmp.has('structure:typo'), 'a unexistent key should return false')

  t.end()
})

// assert.equal(tmp.has('separator'), false, 'separator should be hidden')

// assert.ok(tmp.set('val', 'val'))
// assert.equal(tmp.get('val'), 'val', 'Object should respond with `val`')
// assert.ok(tmp.set('val:tr', 'lol'))
// assert.equal(tmp.get('val:tr'), 'lol')
// assert.ok(tmp.get('val'))
