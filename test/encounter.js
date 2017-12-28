import { assert } from "chai";
import { fromFile } from "index";
import Encounter from "encounter";
import Squad from "squad";
import SmarterBuffer from "smarter-buffer";
import moment from "moment";

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

    it("should return a valid build version", function(done) {
      encounter
        .buildVersion()
        .then(buildVersion => {
          assert.typeOf(buildVersion, "string");
          assert.lengthOf(buildVersion, 12);

          assert.equal(buildVersion.slice(0, 4), "EVTC");

          const buildDate = moment(buildVersion.slice(4), "YYYYMMDD");
          assert.isNotNaN(buildDate);
          done();
        })
        .catch(done);
    });
  });
});
