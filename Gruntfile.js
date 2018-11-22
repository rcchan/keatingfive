/* jshint node: true, camelcase: false */
var SRC_DIR = 'src/';
var SRC_JS = SRC_DIR + 'js/';
var SRC_CSS = SRC_DIR + 'css/';
var SRC_LIB = SRC_DIR + 'lib/';
var SRC_LAYOUTS = SRC_DIR + 'layouts/';
var SRC_PARTIALS = SRC_DIR + 'partials/';
var SRC_VIEWS = SRC_DIR + 'views/';
var BUILD_DIR = 'build/';
var BUILD_JS = BUILD_DIR + 'js/';
var BUILD_CSS = BUILD_DIR + 'css/';

var cssmin_files = {};
cssmin_files[BUILD_CSS + '_lib.min.css'] = [SRC_LIB + '**/*.css', '!**/*.min.css'];

var stylus_files = {};
stylus_files[BUILD_CSS + '_styles.min.css'] = [SRC_CSS + '**/*.styl'];

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: [BUILD_DIR],

    concat: {
      js: {
        src: [
          SRC_LIB + '**/*.min.js',
          SRC_LIB + '**/*.js',
          SRC_JS + '**/*.min.js',
          SRC_JS + '**/*.js'
        ],
        dest: BUILD_JS + 'scripts.js'
      },
      minjs: {
        src: [
          SRC_LIB + '**/*.min.js',
          BUILD_JS + '_lib.min.js',
          SRC_JS + '**/*.min.js',
          BUILD_JS + '_scripts.min.js',
        ],
        dest: BUILD_JS + 'scripts.min.js'
      },
      css: {
        src: [
          SRC_LIB + '**/*.min.css',
          BUILD_CSS + '_lib.min.css',
          SRC_CSS + '**/*.min.css',
          BUILD_CSS + '_styles.min.css',
        ],
        dest: BUILD_CSS + 'styles.css'
      }
    },

    jshint: {
      gruntfile: {src: ['Gruntfile.js']},
      src: {src: [SRC_DIR + '**/*.js']},
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      html: {
        files: [
          SRC_LAYOUTS + '**/*',
          SRC_PARTIALS + '**/*',
          SRC_VIEWS + '**/*',
        ],
        tasks: ['assemble']
      },
      js: {
        files: [SRC_JS + '**/*.js'],
        tasks: ['closure-compiler:js', 'concat:js', 'concat:minjs']
      },
      jslib: {
        files: [SRC_LIB + '**/*.js'],
        tasks: ['closure-compiler:lib', 'concat:js', 'concat:minjs']
      },
      css: {
        files: [SRC_CSS + '**/*.styl'],
        tasks: ['stylus:css', 'concat:css']
      },
      csslib: {
        files: [SRC_LIB + '**/*.css'],
        tasks: ['cssmin:lib', 'concat:css']
      }
    },

    'closure-compiler': {
      js: {
        closurePath: 'tools/closure-compiler',
        js: [SRC_JS + '**/*.js', '!**/*.min.js'],
        jsOutputFile: BUILD_JS + '_scripts.min.js',
        maxBuffer: 5000,
        options: {
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5'
        },
        noreport: true
      },

      lib: {
        closurePath: 'tools/closure-compiler',
        js: [SRC_LIB + '**/*.js', '!**/*.min.js'],
        jsOutputFile: BUILD_JS + '_lib.min.js',
        maxBuffer: 5000,
        options: {
          compilation_level: 'SIMPLE_OPTIMIZATIONS',
          language_in: 'ECMASCRIPT5'
        },
        noreport: true
      }
    },
    
    cssmin: {
      lib: {
        files: cssmin_files
      }
    },
    
    stylus: {
      css: {
        files: stylus_files
      }
    },

    assemble: {
      options: {
        layoutdir: SRC_LAYOUTS,
        partials: SRC_PARTIALS + '**/*'
      },
      views: {
        expand: true,
        cwd: SRC_DIR,
        options: { layout: 'default.hbs' },
        src: [SRC_VIEWS.substring(SRC_DIR.length) + '**/*'],
        filter: 'isFile',
        dest: BUILD_DIR
      }
    },
    
    symlink: {
      img: {
        src: 'src/img',
        dest: 'build/img'
      },
      files: {
        src: 'src/files',
        dest: 'build/files'
      },
      '.htaccess': {
        src: 'src/.htaccess',
        dest: 'build/.htaccess'
      }
    }
  });

  grunt.loadNpmTasks('grunt-assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-closure-compiler');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-symlink');

  grunt.registerTask('default', ['stylus', 'cssmin', 'closure-compiler', 'concat', 'assemble', 'symlink']);
  grunt.registerTask('test', ['jshint']);
};
