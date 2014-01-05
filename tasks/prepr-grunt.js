var prepr = require("../src/prepr"),
    fs = require("fs"),
    path = require("path");

module.exports = function(grunt) {

    //TODO: Support asynchronous preprocessing (add option for this)
    //TODO: Do not read the whole file into memory (add option for this)
    //TODO: Option for switching logging on (log: true)
    grunt.registerMultiTask('prepr', 'Preprocess source file', function() {
        //TODO: Implement
        var defined = this.data.defined,
            files = grunt.file.expand(this.data.src),
            destFolder = this.data.dest,
            logging = this.data.logging;

        logging = true;

        files.forEach(function(file) {
            if (logging) {
                console.log("Preprocessing " + file);
            }

            var fileContents = fs.readFileSync(file).toString(),
                preprocessedFileContents = prepr.preprocess(fileContents, defined),
                destFile = destFolder ? destFolder + path.sep + path.basename(file) : file;

            if (logging) {
                console.log("Writing to " + destFile);
            }

            fs.writeFileSync(destFile, preprocessedFileContents);
        });
    });
};