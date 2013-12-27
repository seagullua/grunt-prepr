var prepr = (require ? require("../src/prepr") : this.prepr);

describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);

    prepr.preprocess();
  });
});