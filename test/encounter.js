import chai, { assert } from "chai";
import { fromFile } from "index";
import { Encounter } from "encounter";
import Squad from "squad";
import BossAgent from "agent/boss";
import SmarterBuffer from "smarter-buffer";
import moment from "moment";

chai.use(require("chai-moment"));

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
  });

  describe("Agents", () => {
    it("should generate a list of agents", function(done) {
      encounter
        .agents()
        .then(agents => {
          assert.typeOf(agents, "array");
          assert.isAtLeast(agents.length, 1);
          done();
        })
        .catch(done);
    });

    it("should generate a single boss agent", function(done) {
      encounter
        .agents("isBoss")
        .then(agents => {
          assert.equal(agents.length, 1);
          done();
        })
        .catch(done);
    });

    it("should generate 1 to 10 player agents", function(done) {
      encounter
        .agents("isPlayer")
        .then(agents => {
          assert.isAtLeast(agents.length, 1);
          assert.isAtMost(agents.length, 10);
          done();
        })
        .catch(done);
    });

    it("should return a valid BossAgent instance", function(done) {
      encounter
        .boss()
        .then(boss => {
          assert.instanceOf(boss, BossAgent);
          done();
        })
        .catch(done);
    });

    it("should return a valid Squad instance", function(done) {
      encounter
        .squad()
        .then(squad => {
          assert.instanceOf(squad, Squad);
          done();
        })
        .catch(done);
    });
  });

  describe("Skills", () => {
    it("should generate a list of skills", function(done) {
      encounter
        .skills()
        .then(skills => {
          assert.typeOf(skills, "array");
          assert.isAtLeast(skills.length, 1);
          done();
        })
        .catch(done);
    });
  });

  describe("Combat Events", () => {
    it("should generate a list of combat events", function(done) {
      encounter
        .combatEvents()
        .then(combatEvents => {
          assert.typeOf(combatEvents, "array");
          assert.isAtLeast(combatEvents.length, 1);
          done();
        })
        .catch(done);
    });

    it("should return encounter start time", function(done) {
      encounter
        .startTime()
        .then(startTime => {
          assert(moment.isMoment(startTime));
          assert(startTime.isValid());
          done();
        })
        .catch(done);
    });

    it("should return encounter end time", function(done) {
      encounter
        .endTime()
        .then(endTime => {
          assert(moment.isMoment(endTime));
          assert(endTime.isValid());
          assert(endTime);
          done();
        })
        .catch(done);
    });

    it("should have a positive, nonzero encounter duration", function(done) {
      Promise.all([encounter.startTime(), encounter.endTime()]).then(times => {
        assert.beforeMoment(times[0], times[1]);
        done();
      });
    });

    it("should determine if the encounter was a success", function(done) {
      encounter.bossKilled().then(bossKilled => {
        assert.typeOf(bossKilled, "boolean"); //TODO: smarter check
        done();
      });
    });
  });
});
