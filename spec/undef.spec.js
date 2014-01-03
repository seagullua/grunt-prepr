var prepr = (require ? require("../src/prepr") : this.prepr);

describe("#undef directive", function() {

    it("can be used to undefine a predefined variable", function() {
        var input = "#ifdef var1\n\
line1\n\
#endif\n\
#undef var1\n\
#ifdef var1\n\
line2\n\
#endif";
        var expected = "line1";

        expect(prepr.preprocess(input, ["var1"])).toBe(expected);
    });
    
    it("does not raise exception with a variable that was not defined", function() {
        var input = "#undef var1\n\
line1";
        var expected = "line1";

        expect(prepr.preprocess(input)).toBe(expected);
    });
    
    it("can be used to undefine a variable defined with #define", function() {
        var input = "#define var1\n\
#ifdef var1\n\
line1\n\
#endif\n\
#undef var1\n\
#ifdef var1\n\
line2\n\
#endif";
        var expected = "line1";

        expect(prepr.preprocess(input)).toBe(expected);
    });

    it("undefines a variable that is both predefined and declared with #define", function() {
        var input = "#define var1\n\
#ifdef var1\n\
line1\n\
#endif\n\
#undef var1\n\
#ifdef var1\n\
line2\n\
#endif";
        var expected = "line1";

        expect(prepr.preprocess(input, "var1")).toBe(expected);
    });
    
    it("can be used wrapped in a multiline comment", function() {
        var input = "#ifdef var1\n\
line1\n\
#endif\n\
/*#undef var1*/\n\
#ifdef var1\n\
line2\n\
#endif";
        var expected = "line1";

        expect(prepr.preprocess(input, ["var1"])).toBe(expected);
    });
    
    it("is case insensitive for predefined variables", function() {
        var input = "#undef VAR1\n\
#undef var2\n\
#ifdef var1\n\
line1\n\
#endif\n\
#ifdef VAR2\n\
line2\n\
#endif\n\
line3";
        var expected = "line3";

        expect(prepr.preprocess(input, ["var1", "VAR2"])).toBe(expected);
    });
    
    it("is case insensitive for variables declared with #define", function() {
        var input = "#define var1\n\
#define VAR2\n\
#undef VAR1\n\
#undef var2\n\
#ifdef var1\n\
line1\n\
#endif\n\
#ifdef VAR2\n\
line2\n\
#endif\n\
line3";
        var expected = "line3";

        expect(prepr.preprocess(input)).toBe(expected);
    });

});