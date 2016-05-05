
module.exports = function(grunt) {

  /*
    files: {
      'dest/output.min.js': ['js/src/**\/*.js']
    }
  */

  var _web = grunt.option( "web" );
  var _drive = grunt.option( "drive" );

  var path = "";

      modulesToCompile = {};
      mainJsFile = {};
      
      modulesToCompile[path+"js/dist/libs.min.js"] = [ 
        path+'js/lib/*.js'
      ];
      mainJsFile[path+"js/dist/main.min.js"] = [ 
        path+'js/*.js',
        path+'js/src/modules/**/*.js',
        path+'js/src/modules/*.js'
      ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      src: {
        files: [
          path+'js/*.js',
          path+'js/src/modules/**/*.js',
          path+'js/src/modules/*.js'
        ],
        tasks: ['js'],
        options: {
          spawn: false,
        }
      }
    },//end-watch
    uglify: {
      options: {
        compress: {},
        mangle: {
          except: ['jQuery', 'angular']
        }
      },
      build: {
        files: [
          mainJsFile,
          modulesToCompile
        ]
      }
    },
  });

grunt.event.on('watch', function(action, filepath, target) {
  grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
});

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  
  // Default task(s).
  grunt.registerTask('js', ['uglify']);
  grunt.registerTask('w', ['watch']);

};