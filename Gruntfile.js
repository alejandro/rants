/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
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
        unused: true,
        boss: true,
        eqnull: true,
        globals: {
          jQuery: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      lib_test: {
        src: ['lib/**/*.js', 'test/**/*.js']
      }
    },
    nodeunit: {
      files: ['test/**/*_test.js']
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib_test: {
        files: '<%= jshint.lib_test.src %>',
        tasks: ['jshint:lib_test', 'nodeunit']
      }
    }
  });

  // These plugins provide necessary tasks.
  
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('list','make the list of rants', function (){
    var files = require('fs').readdirSync('./')
      , path = require('path')
      , rants = []
      , ignore = ['.git', '.gitignore','node_modules']

    files.forEach(function (item){
      if (path.extname(item) === '' && ignore.indexOf(item) < 0) {
        rants.push(item)
      }
    })

    var readme = grunt.file.read('./readme.tmpl.md')


    rants = rants.map(function (rant) {
      return ' - [' + rant  + '](http://github.com/alejandro/rants/blob/master/' + rant + ')'
    })

    grunt.file.write('./README.md', grunt.template.process(readme, {data: {rants: rants.join('\n')}}))
    
    grunt.log.write('done')
  })
  // Default task.
  grunt.registerTask('default', ['list']);

};
