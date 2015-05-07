module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			everything: {
				files: ['**/*']
			}
		},
		browserSync: {
			dev: {
				bsFiles: {
					src : [
						'**/*'
					]
				},
				options: {
					watchTask: true,
					server: './'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');

	grunt.registerTask('default', ['browserSync', 'watch']);
}