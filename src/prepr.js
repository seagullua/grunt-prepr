(function(host) {

    var outputLineSeparator = "\n",
        directivesStack = [];

    function getOutputLineSeparator(input) {
        return input.indexOf("\r\n") >= 0 ? "\r\n" : "\n";
    }

    function getDirectiveStackRepresentation() {
        return directivesStack.map(function(directive) {
            return directive.definition;
        }).join(",");
    }

    function IfDirective(definition, definedVariables, parentIfDirective) {
        var directiveMatch = /#ifdef +(\S*)?/.exec(definition);

        this.definition = definition;
        this.variableName = directiveMatch[1].toUpperCase();
        this.ignoreContent = (definedVariables.indexOf(this.variableName) < 0);

        if (parentIfDirective) {
            this.ignoreContent = this.ignoreContent || parentIfDirective.ignoreContent;
        }
    }

    IfDirective.prototype.processLine = function(line) {
        return this.ignoreContent ? "" : line + outputLineSeparator;
    };

    var exported = {
        preprocess: function(input, definedVariables) {
            var lines = input.split(/\r?\n/),
                output = "";

            if (typeof definedVariables == "string") {
                definedVariables = [definedVariables];
            }
            
            outputLineSeparator = getOutputLineSeparator(input);

            definedVariables = definedVariables.map(function(str) { 
                return str.toUpperCase();
            });
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i],
                    topIfDirective = directivesStack[directivesStack.length - 1];

                if (/#ifdef/.exec(line)) {
                    directivesStack.push(new IfDirective(line, definedVariables, topIfDirective));
                } else if (/#endif/.exec(line)) {
                    if (directivesStack.length == 0) {
                        throw new Error("Found #endif without opening directive");
                    }
                    directivesStack.pop();
                } else {
                    line = topIfDirective ? topIfDirective.processLine(line) : line + outputLineSeparator;

                    output = output + line;
                }
            };

            if (directivesStack.length > 0) {
                throw new Error("Unclosed if directives found " + getDirectiveStackRepresentation());
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