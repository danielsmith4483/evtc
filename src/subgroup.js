module.exports = class Subgroup {
  constructor(subgroupNumber) {
    this._subgroupNumber = subgroupNumber;

    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  subgroupNumber() {
    return this._subgroupNumber;
  }

  dps() {
    return this.players.reduce((acc, cur) => acc + cur.dps(), 0);
  }
};
