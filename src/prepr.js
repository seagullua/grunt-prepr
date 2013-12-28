(function(host) {

    function getOutputLineSeparator(input) {
        return input.indexOf("\r\n") >= 0 ? "\r\n" : "\n";
    }

    var exported = {
        preprocess: function(input, defines) {
            var lines = input.split(/\r?\n/),
                ignoreLines = false,
                output = "",
                outputLineSeparator = getOutputLineSeparator(input);

            defines = defines.map(function(str) { 
                return str.toUpperCase();
            });
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i],
                    isStartDirective = /#ifdef +(\S*)?/.exec(line),
                    isEndDirective = /#endif/.exec(line),
                    isDirective = isStartDirective || isEndDirective;

                if (isStartDirective) {
                    var mode = isStartDirective[1];

                    if (defines.indexOf(mode.toUpperCase()) < 0) {
                        ignoreLines = true;
                    }
                } 
                if (!ignoreLines && !isDirective) {
                    output = output + line + outputLineSeparator;
                }
                if (isEndDirective) {
                    ignoreLines = false;
                }
            };
            return output.substring(0, output.length - outputLineSeparator.length);
        }
    };

    if (module) {
        module.exports = exported;
    } else {
        host.prepr = exported;
    }
})(this);