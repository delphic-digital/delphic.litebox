module.exports = function(grunt) {

	grunt.initConfig({
		browserSync: {
			dev: {
				bsFiles: {
					src : [
						'**/*'
					]
				},
				options: {
					server: './'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-browser-sync');

	grunt.registerTask('default', ['browserSync', 'watch']);
}