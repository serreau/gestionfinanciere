module.exports = function(grunt) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
	  watch: {
		all: {
		  options: { livereload: true, spawn: false },
		  files: ['source/**/*']
		}
	  },

	  karma: {
		unit: {
			configFile: 'karma.conf.js',
			background: true
		}
	  }

	});

}