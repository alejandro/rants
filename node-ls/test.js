var localStorage = require('./')
var assert = require('assert')
localStorage.setPermanent = false

localStorage.setItem('uno', 1).setItem('dos', 2).setItem('tres', 3)

var first = localStorage.key(0)


assert.equal(first, 'uno')
assert.equal(localStorage.getItem('tres'), 3)
assert.equal(localStorage.tres, 3)
assert.ok(localStorage.clear())
assert.equal(localStorage.tres, undefined)
localStorage.key(1)
console.log('All test passed')
