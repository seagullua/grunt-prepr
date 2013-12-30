(function(host) {

    function ConditionalDirective() {
    }
    
    ConditionalDirective.prototype.init = function(definition, definedVariables, outputLineSeparator, parentIfDirective) {
        var directiveMatch = /#ifn?def +(\S*)?/.exec(definition);

        this.definition = definition;
        this.variableName = directiveMatch[1].toUpperCase();
        this.isVariableDefined = (definedVariables.indexOf(this.variableName) >= 0);
        this.outputLineSeparator = outputLineSeparator;
        this.ignoreContent = this.shouldIgnoreContent(this.isVariableDefined);

        if (parentIfDirective) {
            this.ignoreContent = this.ignoreContent || parentIfDirective.ignoreContent;
        }
    };

    ConditionalDirective.prototype.processLine = function(line) {
        return this.ignoreContent ? "" : line + this.outputLineSeparator;
    };

    function IfDirective() {
    }

    IfDirective.prototype = new ConditionalDirective();

    IfDirective.prototype.shouldIgnoreContent = function(isVariableDefined) {
        return !isVariableDefined;
    };

    function IfNotDirective() {
    }

    IfNotDirective.prototype = new ConditionalDirective();

    IfNotDirective.prototype.shouldIgnoreContent = function(isVariableDefined) {
        return isVariableDefined;
    };

    function Preprocessor(input, definedVariables) {
        this.input = input;

        if (typeof definedVariables == "string") {
            definedVariables = [definedVariables];
        }
        this.definedVariables = definedVariables.map(function(str) { 
            return str.toUpperCase();
        });

        this.outputLineSeparator = input.indexOf("\r\n") >= 0 ? "\r\n" : "\n",
        this.directivesStack = [];
    }

    Preprocessor.prototype.run = function() {
        var lines = this.input.split(/\r?\n/),
            output = "";

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i],
                conditionalDirective = null,
                topConditionalDirective = this.directivesStack[this.directivesStack.length - 1];

            if (/#ifdef/.exec(line)) {
                conditionalDirective = new IfDirective();
                conditionalDirective.init(line, this.definedVariables, this.outputLineSeparator, topConditionalDirective);
                this.directivesStack.push(conditionalDirective);
            } else if (/#ifndef/.exec(line)) {
                conditionalDirective = new IfNotDirective();
                conditionalDirective.init(line, this.definedVariables, this.outputLineSeparator, topConditionalDirective);
                this.directivesStack.push(conditionalDirective);
            } else if (/#endif/.exec(line)) {
                if (this.directivesStack.length == 0) {
                    throw new Error("Found #endif without opening directive");
                }
                this.directivesStack.pop();
            } else {
                line = topConditionalDirective ? topConditionalDirective.processLine(line) : line + this.outputLineSeparator;

                output = output + line;
            }
        };

        if (this.directivesStack.length > 0) {
            throw new Error("Unclosed if directives found " + this.getDirectiveStackRepresentation());
        };

        return output.substring(0, output.length - this.outputLineSeparator.length);
    };
    
    Preprocessor.prototype.getDirectiveStackRepresentation = function() {
        return this.directivesStack.map(function(directive) {
            return directive.definition;
        }).join(",");
    };

    var exported = {
        preprocess: function(input, definedVariables) {
            return new Preprocessor(input, definedVariables).run();
        }
    };

    if (module) {
        module.exports = exported;
    } else {
        host.prepr = exported;
    }
})(this);