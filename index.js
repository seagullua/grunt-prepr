/**
 * Created by chaika on 20.03.16.
 */
var prepr = require("./src/prepr")
var through = require('through');
exports.browserify = function(defined) {
    return function(file) {
        var data = '';
        return through(function(buf) {
            data += buf;
        }, function() {
            var self = this;

            var preprocessedFileContents = prepr.preprocess(data, defined);
            self.queue(preprocessedFileContents);
            self.queue(null);
        });
    }
};