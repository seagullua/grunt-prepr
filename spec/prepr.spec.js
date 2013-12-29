var prepr = (require ? require("../src/prepr") : this.prepr);

describe("prepr preprocessor", function() {

    it("leaves input without directives intact", function() {
        var input = "var x = 78;\n\
var z = x * 2;";
        var expected = "var x = 78;\n\
var z = x * 2;";

        expect(prepr.preprocess(input, ["PROD"])).toBe(expected);
    });

    it("produces Windows line endings in output if they are used in input", function() {
        var input = "#ifdef var1\r\n\
line1\r\n\
#endif\r\n\
line2";
        var expected = "line1\r\n\
line2";

        expect(prepr.preprocess(input, ["var1"])).toBe(expected);
    });

    it("produces Windows line endings in output if mixed line endings are used in input", function() {
        var input = "#ifdef var1\r\n\
line1\r\n\
line2\n\
#endif\n\
line3";
        var expected = "line1\r\n\
line2\r\n\
line3";

        expect(prepr.preprocess(input, ["var1"])).toBe(expected);
    });

    it("raises error when too many #endif", function() {
        expect(function() {
            prepr.preprocess("#endif", ["var1"]);
        }).toThrow(new Error("Found #endif without opening directive"));
    });

    //TODO: Add the ability to pass only one variable and not as an array
});