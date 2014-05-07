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
		    tasks: ['imagemin.dev'],
		    options: {
		        livereload: true
		    }
		},
		js: {
		    files: ['src/**/*.js'],
		    tasks: ['jshint', 'concat.dev', 'uglify.dev'],
		    options: {
		        livereload: true
		    }
		},
		scss: {
		    files: ['src/**/*.scss'],
		    tasks: ['sass.dev', 'csslint'],
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
			    options: {
			        style: 'nested',
			        noCache: false,
			        banner: '/*! <%= pkg.appname %> version <%= pkg.appversion %> */\n',
			    },
			    files: {
			        'src/<%= pkg.appname %>.scss': ['dev/css/<%= pkg.appname %>.css']
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
			options: {
			    import: 2
			},
			src: ['dev/css/<%= pkg.appname %>.css']
		}

      	/* MISE EN FORME DES FICHIERS */
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.appname %> version <%= pkg.appversion %> concatened */\n',
            },
            dev: {
                src: ['src/**/*.js'],
                dest: 'dev/js/<%= pkg.appname %>.js'
            },
            build: {
                src: ['src/**/*.js'],
                dest: 'build/js/<%= pkg.appname %>.js'
            }
        },
        uglify: {
            dev: {
                options: {
                    compress: false,
                    beautify: true,
                },
                files: {
                    'dev/js/<%= pkg.appname %>.min.js': ['dev/js/<%= pkg.appname %>.js']
                }
            },
            build: {
                options: {
                    compress: true,
                    beautify: false,
                },
                files: {
                    'build/js/<%= pkg.appname %>.min.js': ['build/js/<%= pkg.appname %>.js']
                }
            }
        },
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
                options: {
                    optimizationLevel: 1,
                    progressive: false,
                    interlaced: false
                },
                files: {
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dev/img/'
                }
            },
            build: {
                options: {
                    optimizationLevel: 7
                    progressive: true,
                    interlaced: false
                },
                files: {
                    expand: true,
                    cwd: 'src/img/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'build/img/'
                }
            }
        },
        copy: {
            dev : {
                files: [
                     {expand: true, src: ['src/**/*.html'], dest: 'dev/'},
                     {expand: true, src: ['libs'], dest: 'dev/'}
                ]
            },
            build: {
                files: [
                     {expand: true, src: ['src/**/*.html'], dest: 'build/'},
                     {expand: true, src: ['libs'], dest: 'build/'}
                ]
            }
        },
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
		}

        /* NETTOYAGE */
        clean: ['build/js/<%= pkg.appname %>.min.js', 'build/js/<%= pkg.appname %>.js', 'build/css/<%= pkg.appname %>.css', 'build/img/']

	});

	grunt.registerTask('default', ['watch']);
    grunt.registerTask('dev', ['watch', 'sass', 'jshint', 'csslint', 'concat', 'autoprefixer', 'uglify', 'imagemin']);
    grunt.registerTask('build', ['sass', 'concat', 'autoprefixer', 'uglify', 'imagemin', 'compress','ftp-deploy']);
    grunt.registerTask('clean', ['clean']);

}

/*

	TODO
	----
    karma tests
	start a http server
	launch chrome in a particular URL
	download a mysql database
	launch a xcode compilation
	modify version number
	launch a java compile

*/