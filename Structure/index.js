module.exports = Structure

function Structure(structure){
  if (!(this instanceof Structure)) return new Structure(structure)
  if ('keepStructure' in structure) {
    this.keepStructure = structure.keepStructure
    delete structure.keepStructure
  } else this.keepStructure = false
  if (structure) this.structure = structure
  if (this.init) this.init()
}

Structure.prototype.get = function (){
  return this.structure
}

Structure.prototype.add = function (key, val){
  this.structure[key] = val
}
Structure.prototype.del = function (key){
  delete this.structure[key]
}

// idiomatics
Structure.prototype.isSafe =
Structure.prototype.isValid =
Structure.prototype.check = function(item) {
  if (!this.structure) throw new Error('no structure found')
  if (typeof this.structure !== 'object') throw new TypeError('structure must be an object')  
  
  var struct = this.structure
    , skeys = Object.keys(struct)
    , nkeys = Object.keys(item)
    , slength = skeys.length
    , nlength = nkeys.length
    , valid

  if (nlength > slength && !this.keepStructure) throw new Error('you can not have more data than structure')

  function filterKey(key){
    var type = struct[key]
      , target = item[key]
      , isArray = Array.isArray(type)
      , dtype
    
    if (isArray && type[0] instanceof Structure) {
      if (!Array.isArray(target)) return false
      dtype = type[0]
      return target.filter(function (item){
        return dtype.isSafe(item)
      }).length === target.length
    }
    if (isArray) return type.indexOf(target) !== -1
    if (type === 'date')  return target instanceof Date
    if (type === 'array') return Array.isArray(target)
    if (type instanceof Structure) return type.isSafe(target)
    return type === typeof target
  }
  
  valid = skeys.filter(filterKey)
  if (valid.length !== skeys.length) return false
  return true
};

Structure.prototype._from = function (type){
  if (type === 'string') return 'string'
  if (type == 'date') return new Date
  if (type == 'number') return +new Date
  if (Array.isArray(type)) {
    if (type[0] instanceof Structure) return [type[0].clean({})]
    return type[0]
  }
  if (type == 'object') return {}
  if (type instanceof Structure) return type.clean({})
  return 'unknown'
}

Structure.prototype.clean =
Structure.prototype.create = function (item){
  var newi = {}
    , struct = this.structure
  Object.keys(struct).forEach(function (key){
    if (item[key]) newi[key] = item[key]
    else newi[key] = this._from(struct[key])
  }, this)
  return newi
}
