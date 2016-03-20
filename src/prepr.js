(function(host) {

    String.prototype.toRegexLiteral = String.prototype.toRegexLiteral || function(str) {

        // http://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
        return this.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    };

    function ConditionalDirective(preprocessor) {
        this.preprocessor = preprocessor;
    }

    ConditionalDirective.prototype.init = function(definition,
            outputLineSeparator, parentConditionalDirective) {
        var directiveMatch = /#ifn?def +([a-zA-Z0-9_\-]*)?/.exec(definition);

        this.definition = definition;
        this.variableName = directiveMatch[1].toUpperCase();
        this.isVariableDefined = (this.preprocessor.getDefinedVariables()
                .indexOf(this.variableName) >= 0);
        this.outputLineSeparator = outputLineSeparator;
        this.ignoreContent = this.shouldIgnoreContent(this.isVariableDefined);

        if (parentConditionalDirective) {
            this.ignoreContent = this.ignoreContent || parentConditionalDirective.ignoreContent;
        }
    };

    ConditionalDirective.prototype.processLine = function(line) {
        return this.ignoreContent ? this.outputLineSeparator : line + this.outputLineSeparator;
    };

    ConditionalDirective.prototype.invert = function() {
        this.ignoreContent = !this.ignoreContent;
    };

    ConditionalDirective.create = function(preprocessor, definition,
            outputLineSeparator, parentConditionalDirective) {
        var directive = null;

        if (/#ifdef/.exec(definition)) {
            directive = new IfDirective(preprocessor);
        } else if (/#ifndef/.exec(definition)) {
            directive = new IfNotDirective(preprocessor);
        }
        directive.init(definition, outputLineSeparator,
                parentConditionalDirective);
        return directive;
    };

    function IfDirective(preprocessor) {
        ConditionalDirective.call(this, preprocessor);
    }

    IfDirective.prototype = new ConditionalDirective();

    IfDirective.prototype.shouldIgnoreContent = function(isVariableDefined) {
        return !isVariableDefined;
    };

    function IfNotDirective(preprocessor) {
        ConditionalDirective.call(this, preprocessor);
    }

    IfNotDirective.prototype = new ConditionalDirective();

    IfNotDirective.prototype.shouldIgnoreContent = function(isVariableDefined) {
        return isVariableDefined;
    };

    function Macro(preprocessor) {
        this.preprocessor = preprocessor;
    }

    Macro.prototype.parse = function(definition) {
        var match = /#define\s+([\$a-zA-Z][a-zA-Z0-9_]*)\((.*?)\)\s*(.*?)(?:\*\/)?$/
                .exec(definition);

        if (match) {
            this.name = match[1].toRegexLiteral();
            this.args = match[2];
            this.body = match[3];

            this.args = this.args.split(",").map(function(arg) {
                return arg.trim();
            });
        } else {
            match = /#define\s+([\$a-zA-Z][a-zA-Z0-9_]*)\s*(.*?)(?:\*\/)?$/
                    .exec(definition);

            if (match) {
                this.name = match[1].toRegexLiteral();
                this.args = [];
                this.body = match[2];
            }
        }
        if (!match) {
            throw new Error(
                    "Macro name can contain letters, digits, underscores,\
$ as the first symbol and can start with letter or digit or $");
        }

        return this;
    };

    Macro.prototype.apply = function(line) {
        var self = this, replaceRegex = null, NO_NESTED_PARENTH_REGEX = self.name + "\\(([a-zA-Z0-9, ]*)\\)", 
            NESTED_PARENTH_REGEX = self.name + "\\(([a-zA-Z0-9\\(\\), ]*)\\)";

        if (this.args.length > 0) {
            replaceRegex = line.match(new RegExp(NO_NESTED_PARENTH_REGEX)) ? NO_NESTED_PARENTH_REGEX
                    : NESTED_PARENTH_REGEX;

            return line.replace(new RegExp(replaceRegex, "g"), function(match,
                    argValues) {
                var result = self.body;

                argValues = self.preprocessor.applyMacros(argValues);
                argValues = argValues.split(",").map(function(argValue) {
                    return argValue.trim();
                });

                self.args.forEach(function(arg, index) {
                    result = result.replace(new RegExp(arg, "g"),
                            argValues[index] || arg);
                });
                return result;
            });
        } else {
            replaceRegex = self.name;
            return line.replace(new RegExp(replaceRegex, "g"), function(match) {
                return self.body;
            });
        }
    };

    Macro.create = function(preprocessor, definition) {
        return new Macro(preprocessor).parse(definition);
    };

    function Preprocessor(input, predefinedVariables) {
        this.input = input;

        if (typeof predefinedVariables === "string") {
            predefinedVariables = [ predefinedVariables ];
        } else if (predefinedVariables === undefined) {
            predefinedVariables = [];
        }
        this.predefinedVariables = predefinedVariables.map(function(str) {
            return str.toUpperCase();
        });

        this.outputLineSeparator = input.indexOf("\r\n") >= 0 ? "\r\n" : "\n";
        this.directivesStack = [];
        this.macros = {};
    }

    Preprocessor.prototype.forEachMacro = function(callback) {
        var macro = null;

        for ( var macroName in this.macros) {
            if (this.macros.hasOwnProperty(macroName)) {
                macro = this.macros[macroName];
                if (macro) {
                    callback(macroName, macro);
                }
            }
        }
    };

    Preprocessor.prototype.applyMacros = function(line) {
        var result = line;

        this.forEachMacro(function(macroName, macro) {
            result = macro.apply(result);
        });
        return result;
    };

    Preprocessor.prototype.undefine = function(variableName) {
        var newMacros = null, predefinedVariableIndex = -1;

        predefinedVariableIndex = this.predefinedVariables.indexOf(variableName
                .toUpperCase());
        if (predefinedVariableIndex >= 0) {
            this.predefinedVariables.splice(predefinedVariableIndex, 1);
        }

        newMacros = {};
        this.forEachMacro(function(macroName, macro) {
            if (macroName.toUpperCase() !== variableName.toUpperCase()) {
                newMacros[macroName] = macro;
            }
        });
        this.macros = newMacros;
    };

    Preprocessor.prototype.getDefinedVariables = function() {
        var definedMacroNames = [];

        this.forEachMacro(function(macroName, macro) {
            definedMacroNames.push(macroName.toUpperCase());
        });
        return this.predefinedVariables.concat(definedMacroNames);
    };

    Preprocessor.prototype.run = function() {
        var lines = this.input.split(/\r?\n/), output = "";

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i], currentMacro = null, topConditionalDirective = this.directivesStack[this.directivesStack.length - 1];

            if (/#ifn?def/.exec(line)) {
                this.directivesStack.push(ConditionalDirective
                        .create(this, line, this.outputLineSeparator,
                                topConditionalDirective));
                output += this.outputLineSeparator;
            } else if (/#endif/.exec(line)) {
                if (this.directivesStack.length === 0) {
                    throw new Error("Found #endif without opening directive");
                }
                this.directivesStack.pop();
                output += this.outputLineSeparator;
            } else if (/#else/.exec(line)) {
                if (topConditionalDirective) {
                    topConditionalDirective.invert();
                } else {
                    throw new Error("Found #else without opening directive");
                }
                output += this.outputLineSeparator;
            } else if (/#define/.exec(line)) {
                currentMacro = Macro.create(this, line);

                this.macros[currentMacro.name] = currentMacro;
                output += this.outputLineSeparator;
            } else if (/#undef/.exec(line)) {
                var match = /#undef\s+([a-zA-Z][a-zA-Z0-9_]*)(?:\*\/)?$/
                        .exec(line);

                if (match) {
                    this.undefine(match[1]);
                }
                output += this.outputLineSeparator;
            } else {
                line = topConditionalDirective ? topConditionalDirective
                        .processLine(line) : line + this.outputLineSeparator;
                line = this.applyMacros(line);
                output = output + line;
            }
        }

        if (this.directivesStack.length > 0) {
            throw new Error("Unclosed if directives found " + this.getDirectiveStackRepresentation());
        }

        return output.substring(0, output.length - this.outputLineSeparator.length);
    };

    Preprocessor.prototype.getDirectiveStackRepresentation = function() {
        return this.directivesStack.map(function(directive) {
            return directive.definition;
        }).join(",");
    };

    var exported = {
        preprocess : function(input, predefinedVariables) {
            return new Preprocessor(input, predefinedVariables).run();
        }
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = exported;
    } else {
        host.prepr = exported;
    }
})(this);