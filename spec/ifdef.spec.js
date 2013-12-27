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
  
  it("leaves input without directives intact", function() {
      var input = "var x = 78;\n\
var z = x * 2;";
      var expected = "var x = 78;\n\
var z = x * 2;";

      expect(prepr.preprocess(input, ["PROD"])).toBe(expected);
  });

  //TODO: Several defines
  //TODO: Windows line endings
  //TODO: Different line endings on each line
  //TODO: Possible to specify which line endings to use in output
});