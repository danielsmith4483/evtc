import { assert } from "chai";
import { fromFile } from "index";
import { Encounter } from "encounter";
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

  describe("Constructor", () => {
    it("should initialize a log buffer", () => {
      assert.instanceOf(encounter.logBuffer, SmarterBuffer);
    });
  });

  describe("Basic Stats", () => {
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

    it("should return a valid target species ID", function(done) {
      encounter
        .targetSpeciesId()
        .then(targetSpeciesId => {
          assert.typeOf(targetSpeciesId, "number");
          assert.isAbove(targetSpeciesId, 0);
          done();
        })
        .catch(done);
    });

    it("should return a valid boss name", function(done) {
      encounter
        .bossName()
        .then(bossName => {
          assert.typeOf(bossName, "string");
          done();
        })
        .catch(done);
    });
  });

  describe("Agents", () => {
    it("should generate a list of agents", function(done) {
      const agents = encounter.agents();

      let bossAgent = agents.next();
      console.log(bossAgent);
      bossAgent = agents.next();
      console.log(bossAgent);
      done();
    });
  });
});
