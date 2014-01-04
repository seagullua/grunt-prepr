module.exports = function(grunt) {

  grunt.loadTasks("./../../tasks");
  
  grunt.initConfig({
	prepr: {
		target1: {
			src: "src1.js",
			dest: "src1.processed.js"
		},
		target2: {
			src: "src2.js",
			dest: "src2.processed.js"
		}
	}
  });

  grunt.registerTask('default', 'Running "prepr" with two different targets', function() {
	grunt.task.run("prepr");
  });

};