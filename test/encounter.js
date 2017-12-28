import { assert } from "chai";
import { fromFile } from "index";
import Encounter from "encounter";
import Squad from "squad";
import SmarterBuffer from "smarter-buffer";

describe("Encounter", () => {
  let encounter = null;

  before(function(done) {
    fromFile("test/_evtc_files/20171211-230356.evtc.zip")
      .then(e => {
        encounter = e;
        done();
      })
      .catch(err => {
        console.log(err);
      });
  });

  describe("constructor", () => {
    it("should initialize a log buffer", () => {
      assert.instanceOf(encounter.logBuffer, SmarterBuffer);
    });
  });
});
