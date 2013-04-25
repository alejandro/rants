# Structure

This is a simple module to add a "structure" to your data in JavaScript, it keep
track of data based on previous data structure. 


## Example:

```javascript
var Structure = require('./Structure')
var User = Structure({
  name: 'string',
  last_login: 'date',
  id: 'number'
})

// safe creation
var user = User.create({
  name: 'alejo',
  last_login: +new Date,
  id: 1
})


// From raw object

var user = {
  name: 'alejo',
  last_login: +new Date,
  id: 1
}

var user2 = {
  name: 'alejo',
  id: 1
}
User.isValid(user) // -> false

```

Also you can append structures inside a structure (structureception)

```javascript
// same as User...

var Group = Structure({
  category: 'string',
  created_at: 'date',
  location: 'string',
  users: [User] // Array of `User`'s
})

var fb = Group.create({
  category: 'fb',
  created_at: +new Date,
  location: 'SF',
  users: [user] // from above
})

```

And so on.


## License

MIT 2013 - (c) Alejandro Morales
http://ale.mit-license.orgs
