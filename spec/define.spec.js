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
    
    it("allows to use the same macro on different lines", function() {
        var input = "#define mult(x, y) (x * y)\n\
mult(3, 4);\n\
mult(5, 6);\n\
mult(7, 8);";
        var expected = "(3 * 4);\n\
(5 * 6);\n\
(7 * 8);";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    it("allows to use the same macro a few times on the same line", function() {
        var input = "#define add(x, y) (x + y)\n\
add(3, 4) + add(5, 6) + add(7, 8)";
        var expected = "(3 + 4) + (5 + 6) + (7 + 8)";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    it("processes different spacing for macro arguments", function() {
        var input = "#define array(a, b, c, d, e) [a, b, c, d, e]\n\
array(  1, 2 ,  3  ,4,5)";
        var expected = "[1, 2, 3, 4, 5]";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    it("allows to define and use several macros", function() {
        var input = "#define mult(x, y) (x * y)\n\
#define add(x, y) (x + y)\n\
#define minus(x, y) (x - y)\n\
mult(1, 2);\n\
add(1, 2);\n\
minus(1, 2);";

        var expected = "(1 * 2);\n\
(1 + 2);\n\
(1 - 2);";

        expect(prepr.preprocess(input)).toBe(expected);
    });
    
    /*
     * Not all the combinations are supported, for example, using
     * arithmetical operators in nested macros like mult(add(1, 2) + add(3, 4), 3).
     * 
     * In nested macros arguments can be either alpha-numerical or other allowed nested macros.
     * This is the limitation of the current implementation.
     */
    it("allows nested macros", function() {
        var input = "#define mult(x, y) (x * y)\n\
#define add(x, y) (x + y)\n\
mult(add(1, 2), 3);";
        var expected = "((1 + 2) * 3);";

        expect(prepr.preprocess(input)).toBe(expected);
    });

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