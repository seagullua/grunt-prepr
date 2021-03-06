module.exports = function(grunt) {

  grunt.loadTasks("./../tasks");

  grunt.initConfig({
    prepr: {
      //Mask, output directory specified
      target1: {
        defined: ["PROD"],
          src: "in/*.js",
            dest: "."
      },
      //Mask, outputting in the same directory
      target2: {
        defined: ["DEBUG"],
        src: "in/*.js"
      },
      //File mask, JS and CSS, output directory specified
      target3: {
        defined: ["DEBUG"],
        src: "in/*",
        dest: "."
      },
      //Processing single file
      target4: {
        src: "in/valid_styles_with_variables.css",
        dest: "."
      },
      //Processing recursively all JS files, the tree structure is not preserved
      target5: {
        defined: ["DEBUG"],
        src: "in/**/*.js",
        dest: "."
      }
    }
  });

  grunt.registerTask('default', 'Running "prepr" for all the specified targets', function() {
    grunt.task.run("prepr");
  });

};