module.exports = function(grunt) {

  grunt.loadTasks("./../../tasks");
  
  grunt.initConfig({
    prepr: {
        //Mask, output directory specified
        target1: {
            src: "in/*.js",
            dest: "."
        },
        //Mask, outputting in the same directory
        target2: {
            src: "in/*.js"
        },
        //File mask, JS and CSS, output directory specified
        target3: {
            src: "in/*",
            dest: "."
        },
        //Processing single file
        target4: {
            src: "in/valid_styles_with_variables.css",
            dest: "."
        }
    }
  });

  grunt.registerTask('default', 'Running "prepr" for all the specified targets', function() {
    grunt.task.run("prepr");
  });

};