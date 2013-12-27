(function(host) {
    
    var exported = {
        preprocess: function(input, defines) {
            var lines = input.split(/\r?\n/);
            var ignoreLines = false;
            var output = "";

            defines = defines.map(function(str) { 
                return str.toUpperCase();
            });
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                var isStartDirective = /#ifdef +(\S*)?/.exec(line);
                var isEndDirective = /#endif/.exec(line);
                var isDirective = isStartDirective || isEndDirective;

                if (isStartDirective) {
                    var mode = isStartDirective[1];

                    if (defines.indexOf(mode.toUpperCase()) < 0) {
                        ignoreLines = true;
                    }
                } 
                if (!ignoreLines && !isDirective) {
                    output = output + line + "\n";
                }
                if (isEndDirective) {
                    ignoreLines = false;
                }
            };
            return output.trim();
        }
    };

    if (module) {
        module.exports = exported;
    } else {
        host.prepr = exported;
    }
})(this);