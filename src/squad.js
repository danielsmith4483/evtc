const Subgroup = require("./subgroup");

module.exports = class Squad {
  constructor(players) {
    this._subgroups = players.reduce((subgroups, player) => {
      (subgroups[player.subgroup()] = subgroups[player.subgroup()] || []).push(
        player
      );

      return subgroups;
    }, {});

    Object.entries(this._subgroups).forEach(([subgroup, players]) => {
      this._subgroups[subgroup] = new Subgroup(players);
    });
  }

  async subgroups() {
    return Object.keys(this._subgroup);
  }

  *players() {
    for (const subgroup of this.subgroups) {
      for (const player of subgroup.players) {
        yield player;
      }
    }
  }

  dps() {
    if (this.subgroups.length === 0) {
      return 0;
    }
    return this.subgroups.reduce((acc, cur) => acc + cur.dps(), 0);
  }
};
