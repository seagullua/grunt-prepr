(function(host) {

    function ConditionalDirective() {
    }
    
    ConditionalDirective.prototype.init = function(definition, definedVariables, outputLineSeparator, parentConditionalDirective) {
        var directiveMatch = /#ifn?def +(\S*)?/.exec(definition);

        this.definition = definition;
        this.variableName = directiveMatch[1].toUpperCase();
        this.isVariableDefined = (definedVariables.indexOf(this.variableName) >= 0);
        this.outputLineSeparator = outputLineSeparator;
        this.ignoreContent = this.shouldIgnoreContent(this.isVariableDefined);

        if (parentConditionalDirective) {
            this.ignoreContent = this.ignoreContent || parentConditionalDirective.ignoreContent;
        }
    };

    ConditionalDirective.prototype.processLine = function(line) {
        return this.ignoreContent ? "" : line + this.outputLineSeparator;
    };
    
    ConditionalDirective.prototype.invert = function() {
    	this.ignoreContent = !this.ignoreContent;
    };

    ConditionalDirective.create = function(definition, definedVariables, outputLineSeparator, parentConditionalDirective) {
        var directive = null;

        if (/#ifdef/.exec(definition)) {
            directive = new IfDirective();
        } else if (/#ifndef/.exec(definition)) {
            directive = new IfNotDirective();
        }
        directive.init(definition, definedVariables, outputLineSeparator, parentConditionalDirective);
        return directive;
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

    function Macro() {
    }

    Macro.prototype.parse = function(definition) {
        var match = /#define\s+([a-zA-Z][a-zA-Z0-9_]*)\((.*?)\)\s+(.*?)$/.exec(definition);

        if (match) {
            this.name = match[1];
            this.args = match[2];
            this.body = match[3];

            this.args = this.args.split(",").map(function (arg) {
                return arg.trim();
            });
        } else {
            match = /#define\s+([a-zA-Z][a-zA-Z0-9_]*)\s+(.*?)$/.exec(definition);

            if (match) {
                this.name = match[1];
                this.args = [];
                this.body = match[2];
            }
        }
        return this;
    };

    Macro.prototype.apply = function(line) {
        var self = this;

        return (this.args.length > 0) ? 
            line.replace(new RegExp(self.name + "\\((.*?)\\)", "g"), function(match, argValues) {
                var result = self.body;

                argValues = argValues.split(",").map(function(argValue) {
                    return argValue.trim();
                });

                self.args.forEach(function(arg, index) {
                    result = result.replace(new RegExp(arg, "g"), argValues[index]);
                });
                return result;
            })
            : line.replace(new RegExp(self.name, "g"), function(match) {
                return self.body;
            });
    };

    Macro.create = function(definition) {
        return new Macro().parse(definition);
    };

    function Preprocessor(input, definedVariables) {
        this.input = input;

        if (typeof definedVariables == "string") {
            definedVariables = [definedVariables];
        } else if (definedVariables == undefined) {
        	definedVariables = [];
        }
        this.definedVariables = definedVariables.map(function(str) { 
            return str.toUpperCase();
        });

        this.outputLineSeparator = input.indexOf("\r\n") >= 0 ? "\r\n" : "\n",
        this.directivesStack = [];
        this.macros = {};
    }

    Preprocessor.prototype.applyMacros = function(line) {
        var macro = null,
            result = line;

        for (var macroName in this.macros) {
            if (this.macros.hasOwnProperty(macroName)) {
                macro = this.macros[macroName];
                result = macro.apply(result);
            }
        }
        return result;
    };

    Preprocessor.prototype.run = function() {
        var lines = this.input.split(/\r?\n/),
            output = "";

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i],
                currentMacro = null,
                topConditionalDirective = this.directivesStack[this.directivesStack.length - 1];

            if (/#ifn?def/.exec(line)) {
                this.directivesStack.push(
                    ConditionalDirective.create(line, this.definedVariables, this.outputLineSeparator, topConditionalDirective));
            } else if (/#endif/.exec(line)) {
                if (this.directivesStack.length == 0) {
                    throw new Error("Found #endif without opening directive");
                }
                this.directivesStack.pop();
            } else if (/#else/.exec(line)) {
            	if (topConditionalDirective) {
            	    topConditionalDirective.invert();
            	} else {
            		throw new Error("Found #else without opening directive");
            	}
            } else if (/#define/.exec(line)) {
                currentMacro = Macro.create(line);

                this.macros[currentMacro.name] = currentMacro;
            } else {            	
            	line = topConditionalDirective ? topConditionalDirective.processLine(line) : line + this.outputLineSeparator;
                line = this.applyMacros(line);
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