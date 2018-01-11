import { assert } from "chai";
import Squad from "squad";
import Subgroup from "subgroup";
import PlayerAgent from "agent/player";
import AgentFactory from "agent/factory";

describe("Squad", () => {
  let players = null;

  before(function(done) {
    const playerNames = [
      `Alpha\u0000:Alpha.1234\u00001`,
      `Bravo\u0000:Brave.1234\u00002`,
      `Charlie\u0000:Charlie.1234\u00002`,
      `Delta\u0000:Delta.1234\u00004`
    ];

    const playerPromises = playerNames.map(playerName => {
      return AgentFactory.create({
        isElite: 0,
        name: playerName
      });
    });

    Promise.all(playerPromises).then(playerValues => {
      players = playerValues;
      done();
    });
  });
  it("should initialize a squad with PlayerAgent instances", function() {
    assert.isAtLeast(players.length, 1);
    players.every(player => {
      assert.instanceOf(player, PlayerAgent);
    });

    let squad = null;

    assert.doesNotThrow(function() {
      squad = new Squad(players);
    });
  });

  it("should provide a list of subgroups", function(done) {
    const squad = new Squad(players);

    squad
      .subgroups()
      .then(subgroups => {
        for (const subgroup of subgroups) {
          assert.instanceOf(subgroup, Subgroup);
        }
        done();
      })
      .catch(done);
  });
});
