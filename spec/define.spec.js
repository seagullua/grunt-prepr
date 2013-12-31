var prepr = (require ? require("../src/prepr") : this.prepr);

describe("#define directive", function() {

    it("allows to define simple parameterless macros", function() {
        var input = "#define PI 3.14\n\
2 * PI * r";
        var expected = "2 * 3.14 * r";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    it("allows to define macros with parameters", function() {
        var input = "#define mult(x, y) (x * y)\n\
mult(2, 3);";
        var expected = "(2 * 3);";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    it("does not support multiline macros", function() {
        var input = "#define add(x, y) x + \n\
y\n\
add(1, 2);";
        var expected = "y\n\
1 + ;";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    //TODO: Same macro is used several times on different lines
    //TODO: Same macro is used several times on the same line
    //TODO: A few macros are used
    
    //TODO: Same variable is used several times in a macro body
    //TODO: Several variables in the body of a macro
    //TODO: Macro is case insensitive
    //TODO: Macro is redefined several times, each time the definition is updated
    //TODO: In the macro used in the code not enough arguments are provided
    //TODO: In the macro used in the code too many arguments are provided
    //TODO: Name of macro can be only composed from letters, digits and underscore 
    //TODO: Not all the parameters are used in the body
    //TODO: Not all the parameters used in the body are defined
    //TODO: Using macro defined earlier inside a macro defined later has no effect
});