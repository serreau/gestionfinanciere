module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		/* AUTOMATISATION */
		watch: {
    		//all: {
    		//  options: { livereload: true, spawn: false },
    		//  files: ['source/**/*']
    		//},
    		html: {
    		    files: ['src/**/*.html'],
    		    tasks: ['copy'],
    		    options: {
    		        livereload: true
    		    }
    		},
    		img: {
    		    files: ['src/img/**/*.png', 'src/img/**/*.jpg', 'src/img/**/*.gif'],
    		    tasks: ['imagemin:dev'],
    		    options: {
    		        livereload: true
    		    }
    		},
    		js: {
    		    files: ['src/**/*.js'],
    		    tasks: ['jshint'/*, 'concat.dev'*/, 'uglify:dev'],
    		    options: {
    		        livereload: true
    		    }
    		},
    		scss: {
    		    files: ['src/**/*.scss'],
    		    tasks: ['sass:dev'/*, 'csslint'*/],
    		    options: {
    		        livereload: true
    		    }
    		}
		},

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				background: true
			}
		},

		/* TRANSFORMATION DU CODE */
		sass: {
			dev: {
                options: {                       // Target options
                    style: 'expanded'
                },
                    files: {                         // Dictionary of files
                    'www/css/style.css': 'src/scss/style.scss'//,       // 'destination': 'source'
                    //'widgets.css': 'widgets.scss'
                }
			},
			build: {
			    options: {
			        style: 'compressed',
			        noCache: true,
			        banner: '/*! <%= pkg.appname %> version <%= pkg.appversion %> */\n',
			    },
			    files: {
			        'src/<%= pkg.appname %>.scss': ['build/css/<%= pkg.appname %>.css']
			    }
			}
		},

		/* VERIFICATION DU CODE */
		jshint: {
			src: ['src/**/*.js']
		},
		csslint: {
            dev: {
                options: {
                    import: 2
                },
                src: ['www/css/style.css']
            },
            build: {
                options: {
                    import: 2
                },
                src: ['build/css/style.css']
            }
		},

      	/* MISE EN FORME DES FICHIERS */
        //concat: {
        //    options: {
        //        stripBanners: true,
        //        banner: '/*! <%= pkg.appname %> version <%= pkg.appversion %> concatened */\n',
        //    },
        //    dev: {
        //        src: ['src/**/*.js'],
        //        dest: 'dev/js/<%= pkg.appname %>.js'
        //    },
        //    build: {
        //        src: ['src/**/*.js'],
        //        dest: 'build/js/<%= pkg.appname %>.js'
        //    }
        //},
        uglify: {
            dev: {
                options: {
                    mangle: false,
                    compress: false,
                    beautify: true
                },
                files: {
                    /*'dev/js/<%= pkg.appname %>.min.js': ['dev/js/<%= pkg.appname %>.js']*/
                    'www/js/output.min.js': ['src/**/*.js']
                }
            },
            build: {
                options: {
                    mangle: false,
                    compress: true,
                    beautify: false
                },
                files: {
                    //'build/js/<%= pkg.appname %>.min.js': ['build/js/<%= pkg.appname %>.js']
                    'build/js/output.min.js': ['src/input.js']
                }
            }
        },
        /*uglify: {
            options: {
              mangle: false
            },
            my_target: {
              files: {
                'dest/output.min.js': ['src/input.js']
              }
            }
        },*/
        autoprefixer: {
            dev: {
                src: 'dev/css/<%= pkg.appname %>.css',
            },
            build: {
                src: 'build/css/<%= pkg.appname %>.css',
            }
        },
        imagemin: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'src/img/',
                    src: ['*.{png,jpg,gif}'],
                    dest: 'www/img/'
                }]
            },
            build: {
                dynamic: {
                  files: [{
                    expand: true,
                    cwd: '/src/img/',
                    src: ['*.{png,jpg,gif}'],
                    dest: '/www/img/'
                  }]
                }
            }
        },
        copy: {
            dev : {
                files: [
                     {expand: true, src: ['src/**/*.html'], flatten: true, dest: 'www/'}/*,
                     {expand: true, src: ['libs'], dest: 'dev/'}*/
                ]
            },
            build: {
                files: [
                     {expand: true, src: ['src/**/*.html'], flatten: true, dest: 'build/'}/*,
                     {expand: true, src: ['libs'], dest: 'build/'}*/
                ]
            }
        },

/*main: {
    files: [
      // includes files within path
      {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

      // includes files within path and its sub-directories
      {expand: true, src: ['path/**'], dest: 'dest/'},

      // makes all src relative to cwd
      {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

      // flattens results to a single level
      {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'}
    ]
  } */

        compress: {
            build: {
                options: {
                    archive: '<%= pkg.appname %>.src.<%= pkg.appversion %>.zip'
                },
                files: [
                     {expand: true, src: ['src/**'], dest: '.'}
                ]
            },
            package: {
                options: {
                    archive: '<%= pkg.appname %>.<%= pkg.appversion %>.zip'
                },
                files: [
                     {expand: true, src: ['build/**'], dest: '.'}
                ]
            }
        },
        'ftp-deploy': {
			build: {
				auth: {
				  host: 'server.com',
				  port: 21,
				  authKey: 'key1' // .ftppass
				},
				src: 'path/to/source/folder',
				dest: '/path/to/destination/folder',
				exclusions: ['build/**/.DS_Store', 'build/**/Thumbs.db', 'build/**/*.git*']
			}
		},

        /* NETTOYAGE */
        clean: ['build/js', 'build/css', 'build/img']

	});

	grunt.registerTask('default', ['watch']);
    grunt.registerTask('dev', ['watch', 'sass', 'jshint', /*'csslint',*/ /*'concat',*/ 'autoprefixer', 'uglify', 'imagemin']);
    grunt.registerTask('build', ['sass', /*'concat', */'autoprefixer', 'uglify', 'imagemin', 'compress','ftp-deploy']);
    grunt.registerTask('clean', ['clean']);

}

/*

	TODO
	----
    files deleting
    livereload deleting in build mode
    karma tests
	start a http server
	launch chrome in a particular URL
	download a mysql database
	launch a xcode compilation
	modify version number
	launch a java compile

*/