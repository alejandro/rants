/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    }
  });

  // Default task.
  grunt.registerTask('default', 'list');
  grunt.registerTask('list','make the list of rants', function (){
    var files = require('fs').readdirSync('./')
      , path = require('path')
      , rants =[]
      , ignore = ['.git', '.gitignore']
    files.forEach(function (item){
      if (path.extname(item) === '' && ignore.indexOf(item) < 0) {
        rants.push(item)
      }
    })

    var readme = grunt.file.read('./readme.tmpl.md')


    rants = rants.map(function (rant) {
      return ' - [' + rant  + '](http://github.com/alejandro/rants/blob/master/' + rant + ')'
    })

    grunt.file.write('./README.md', grunt.template.process(readme, {rants: rants.join('\n')}))
    console.log('done')
  })

};
