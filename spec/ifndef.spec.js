describe("#ifndef directive", function() {

    it("processes single defined variable", function() {
        var input = "#ifndef DEBUG\n\
console.log('In the debug mode');\n\
#endif\n\
var x = 1;\n\
#ifndef PROD\n\
var y = x + 1;\n\
#endif";
        var expected = "console.log('In the debug mode');\n\
var x = 1;";

        expect(prepr.preprocess(input, ["PROD"])).toBe(expected);
    });

    it("processes several defined variables", function() {
        var input = "#ifndef var1\n\
line1\n\
#endif\n\
#ifndef var2\n\
line2\n\
#endif\n\
#ifndef var3\n\
line3\n\
#endif\n\
#ifndef var4\n\
line4\n\
#endif\n\
#ifndef var5\n\
line5\n\
#endif";
        var expected = "line2\n\
line4";

        expect(prepr.preprocess(input, ["var1", "var3", "var5"])).toBe(expected);
    });

    it("considers variables case insensitive", function() {
        var input = "#ifndef var1\n\
line1\n\
#endif\n\
#ifndef VAR1\n\
line2\n\
#endif\n\
#ifndef var2\n\
line3\n\
#endif";
        var expected = "line3";

        expect(prepr.preprocess(input, ["var1"])).toBe(expected);
        expect(prepr.preprocess(input, ["VAR1"])).toBe(expected);
    });

    it("ignores leading spaces before directive", function() {
        var input = "  #ifndef var1\n\
  line1\n\
  #endif\n\
    #ifndef var1\n\
    line2\n\
  #endif\n\
 #ifndef var2\n\
line3\n\
    #endif";
        var expected = "line3";

        expect(prepr.preprocess(input, ["var1"])).toBe(expected);
    });

    it("processes nested directives, one active one non-active", function() {
        var input = "#ifndef var1\n\
line1\n\
#ifndef var2\n\
line2\n\
#endif\n\
line3\n\
#endif\n\
#ifndef var2\n\
line4\n\
#ifndef var1\n\
line5\n\
#endif\n\
line6\n\
#endif";
        var expected = "line1\n\
line3";

        expect(prepr.preprocess(input, ["var2"])).toBe(expected);
    });
    it("processes active nested directives", function() {
        var input = "#ifndef var1\n\
line1\n\
#ifndef var2\n\
line2\n\
#ifndef var3\n\
line3\n\
#endif\n\
line4\n\
#endif\n\
line5\n\
#endif";
        var expected = "line1\n\
line2\n\
line3\n\
line4\n\
line5";

        expect(prepr.preprocess(input, ["var4", "var5"])).toBe(expected);
    });

    it("raises error when not closed", function() {
        var input = "#ifndef var1\n\
line1";

        expect(function() {
            prepr.preprocess(input, ["var1"]);
        }).toThrow(new Error("Unclosed if directives found #ifndef var1"));
    });
});