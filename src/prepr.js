(function(host) {

    function getOutputLineSeparator(input) {
        return input.indexOf("\r\n") >= 0 ? "\r\n" : "\n";
    }

    function IfDirective(definition, definedVariables, parentIfDirective) {
        var directiveMatch = /#ifdef +(\S*)?/.exec(definition);

        this.variableName = directiveMatch[1].toUpperCase();
        this.ignoreContent = (definedVariables.indexOf(this.variableName) < 0);

        if (parentIfDirective) {
            this.ignoreContent = this.ignoreContent || parentIfDirective.ignoreContent;
        }
    };

    IfDirective.prototype.processLine = function(line) {
        return this.ignoreContent ? "" : line + outputLineSeparator;
    };

    var outputLineSeparator = "\n",
        ifDirectivesStack = [];

    var exported = {
        preprocess: function(input, definedVariables) {
            var lines = input.split(/\r?\n/),
                output = "";

            outputLineSeparator = getOutputLineSeparator(input);

            definedVariables = definedVariables.map(function(str) { 
                return str.toUpperCase();
            });
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i],
                    topIfDirective = ifDirectivesStack[ifDirectivesStack.length - 1];

                if (/#ifdef/.exec(line)) {
                    ifDirectivesStack.push(new IfDirective(line, definedVariables, topIfDirective));
                } else if (/#endif/.exec(line)) {
                    ifDirectivesStack.pop();
                } else {
                    line = topIfDirective ? topIfDirective.processLine(line) : line + outputLineSeparator;

                    output = output + line;
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