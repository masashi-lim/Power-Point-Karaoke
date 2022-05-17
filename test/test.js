// const {expect} = require("chai");
const expect = chai.expect;

describe("Check test", () => {
  it("console", () => console.log("Hello"));
});

describe("game start", () => {
  it("should start if it have 2 inputs by number", () => {
    expect(gameStart()).to.equal(true);
  });

  describe("count down", () => {
    it("should count down by 1 sec", async () => {
      await countDown();
      expect(countD).to.deep.equal([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]);
    });
  });
});
