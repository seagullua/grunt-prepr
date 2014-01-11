module.exports = function(grunt) {
    "use strict";
    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'tasks/*.js', 'src/*.js'],
            options: {
                multistr: true,
                node: true,
                curly: false,
                eqeqeq: true,
                immed: true,
                latedef: false,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                boss: true,
                eqnull: true
            }
        }
    });

    //TODO: Lint also the examples and tests
    //TODO: Run the tests
    //TODO: Automatically publish the new version to NPM
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint']);
};