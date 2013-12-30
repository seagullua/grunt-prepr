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
1 + ";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    //TODO: Not all the parameters are used in the body
    //TODO: Not all the parameters used in the body are defined
    //TODO: Using macros defined earlier inside a macros defined later has not effect
});