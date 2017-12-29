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
    let agents = null;

    before(function(done) {
      agents = encounter.agents();
      done();
    });

    it("should generate a list of agents", function(done) {
      let agentCount = 0;

      for (const agent of agents) {
        agentCount++;
      }

      assert.equal(agentCount, encounter.agentCount);
      done();
    });

    it("should generate a single boss agent", function(done) {
      let bossAgentCount = 0;
      let agent = null;

      do {
        agent = agents.next("isBoss");
      } while (!agent.done && bossAgentCount++);

      assert.equal(bossAgentCount, 1);
      done();
    });

    it("should generate 1 to 10 player agents", function(done) {
      let playerAgentCount = 0;
      let agent = null;

      do {
        agent = agents.next("isPlayer");
      } while (!agent.done && playerAgentCount++);

      assert.isAtLeast(playerAgentCount, 1);
      assert.isAtMost(playerAgentCount, 10);
      done();
    });
  });
});
