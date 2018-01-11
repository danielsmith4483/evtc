const Subgroup = require("./subgroup");

import { mix, LazyAccessorMixin } from "mixin/lazy-accessor";

module.exports = class Squad extends mix().with(LazyAccessorMixin) {
  constructor(players) {
    super(players);

    this.players = players;
  }

  async subgroups() {
    return this.getAsync("subgroups", () => {
      const subgroups = {};

      for (const player of this.players) {
        const subgroupNumber = player.subgroup();
        if (!(subgroupNumber in subgroups)) {
          subgroups[subgroupNumber] = new Subgroup(subgroupNumber);
        }
        subgroups[subgroupNumber].addPlayer(player);
      }

      return Object.values(subgroups);
    }).then(subgroups => subgroups);
  }

  dps() {
    if (this.subgroups.length === 0) {
      return 0;
    }
    return this.subgroups.reduce((acc, cur) => acc + cur.dps(), 0);
  }
};
