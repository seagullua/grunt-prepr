var prepr = (require ? require("../src/prepr") : this.prepr);

describe("#ifdef directive", function() {

    it("processes single defined variable", function() {
        var input = "#ifdef DEBUG\n\
console.log('In the debug mode');\n\
#endif\n\
var x = 1;\n\
#ifdef PROD\n\
var y = x + 1;\n\
#endif";
        var expected = "var x = 1;\n\
var y = x + 1;";

        expect(prepr.preprocess(input, ["PROD"])).toBe(expected);
    });

    it("processes several defined variables", function() {
        var input = "#ifdef var1\n\
line1\n\
#endif\n\
#ifdef var2\n\
line2\n\
#endif\n\
#ifdef var3\n\
line3\n\
#endif\n\
#ifdef var4\n\
line4\n\
#endif\n\
#ifdef var5\n\
line5\n\
#endif";
        var expected = "line1\n\
line3\n\
line5";

        expect(prepr.preprocess(input, ["var1", "var3", "var5"])).toBe(expected);
    });

    it("considers variables case insensitive", function() {
        var input = "#ifdef var1\n\
line1\n\
#endif\n\
#ifdef VAR1\n\
line2\n\
#endif\n\
#ifdef var2\n\
line3\n\
#endif";
        var expected = "line1\n\
line2";

        expect(prepr.preprocess(input, ["var1"])).toBe(expected);
        expect(prepr.preprocess(input, ["VAR1"])).toBe(expected);
    });

    it("ignores leading spaces before directive", function() {
        var input = "  #ifdef var1\n\
  line1\n\
  #endif\n\
    #ifdef var1\n\
    line2\n\
  #endif\n\
 #ifdef var2\n\
line3\n\
    #endif";
        var expected = "  line1\n\
    line2";

        expect(prepr.preprocess(input, ["var1"])).toBe(expected);
    });
    
    xit("processes nested directives", function() {
        var input = "#ifdef var1\n\
line1\n\
#ifdef var2\n\
line2\n\
#endif\n\
line3\n\
#endif\n\
#ifdef var2\n\
line4\n\
#ifdef var1\n\
line5\n\
#endif\n\
line6\n\
#endif";
        var expected = "line4\n\
line6";

        expect(prepr.preprocess(input, ["var2"])).toBe(expected);
    });

    //TODO: Two nested active directives
    //TODO: Add support for shortcut for only one defined variable
});