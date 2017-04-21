module.exports = function(grunt) {

	// Load Grunt tasks declared in the package.json file
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Project configuration.
	grunt.initConfig({
		watch: {
			scripts: {
				files: [
					'js/**/*.js',
					'html/index.html'
				],
				tasks: ['jshint','concat']
			}
		},
		jshint: {
			options: {
				evil: true
			},
			all: ['js/*.js']
		},
    'http-server': {
      dev: {
        root: 'public',
        port: 3115,
        runInBackground: true
      }
    },
		concat: {
			basic_and_extras: {
				files: {
					'public/js/index.js': ['js/main.js', 'js/**/*.js'],
					'public/index.html': ['html/index.html']
				}
			}
		}

	});

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-watch');
	//grunt.loadNpmTasks('grunt-ssh');
	grunt.registerTask('dev', [
		'watch'
	]);
	grunt.registerTask('build', ['jshint', 'concat']);
	grunt.registerTask('default', ['build', 'http-server', 'dev']);

};
