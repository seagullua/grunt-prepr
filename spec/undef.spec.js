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

    //TODO: Same variable is both predefined and defined, then #undefine undefines both
    //TODO: Using multiline comment with #define
    //TODO: #undef is case sensitive with #define, insensitive with predefined variables
});