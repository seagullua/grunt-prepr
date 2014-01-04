var prepr = require("../src/prepr");

module.exports = function(grunt) {
	
    grunt.registerMultiTask('prepr', 'Preprocess source file', function() {
    	//TODO: Implement
    	console.log(this.target, this.data);
    	
//    	prepr.preprocess();
    });
};