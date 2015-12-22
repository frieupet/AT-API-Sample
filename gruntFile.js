module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.registerTask('tests', 'run mocha-tests', function () {
        var done = this.async();
        require('child_process').exec('mocha ./tests/tests.js', function (err, stdout) {
            grunt.log.write(stdout);
            done(err);
        });
    });

    grunt.registerTask('default', ['tests']);


};
