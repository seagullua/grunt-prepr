var prepr = require("../src/prepr");

module.exports = function(grunt) {
    
    grunt.registerMultiTask('prepr', 'Preprocess source file', function() {
        //TODO: Implement
        var src = this.data.src,
            dest = this.data.dest;

        src = grunt.file.expand(src);
        
        console.log("src =", src);
        console.log("dest = ", dest);
//        prepr.preprocess();
    });
};