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

    it("raises error when too many #endif directives", function() {
        expect(function() {
            prepr.preprocess("#endif", ["var1"]);
        }).toThrow(new Error("Found #endif without opening directive"));
    });

    it("raises error when #else directive without #ifdef or #ifndef", function() {
        expect(function() {
            prepr.preprocess("#else", ["var1"]);
        }).toThrow(new Error("Found #else without opening directive"));
    });
    
    it("allows to pass one variable without wrapping it into an array", function() {
        var input = "#ifdef var1\n\
line1\n\
#endif\n\
line2";
        var expected = "line1\n\
line2";

        expect(prepr.preprocess(input, "var1")).toBe(expected);
    });

    it("processes directives commented out with single line comments", function() {
        var input = "//#ifdef var1\n\
var x = 1;\n\
//#endif\n\
var y = 2;";
        var expected = "var x = 1;\n\
var y = 2;";

        expect(prepr.preprocess(input, "var1")).toBe(expected);
    });

    it("processes macros without parameters commented out with multi-line comments", function() {
        var input = "/*#define begin {\n\
#define end }*/\n\
begin var x = 1; end";
        var expected = "{ var x = 1; }";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    it("processes macros with parameters commented out with multi-line comments", function() {
        var input = "/*#define exp(x, y) x^y*/\n\
exp(2, 3);";
        var expected = "2^3;";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    it("considers variables declared with #define usable in #ifdef", function() {
        var input = "#define JS\n\
#ifdef JS\n\
line1\n\
#endif";
        var expected = "line1";

        expect(prepr.preprocess(input)).toBe(expected);
    });
});