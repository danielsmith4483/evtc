module.exports = class Squad {
  constructor(player) {
    this.players = [];

    if (player) {
      this.addPlayer(player);
    }
  }

  addPlayer(player) {
    this.players.push(player);
  }

  dps() {
    return this.players.reduce((acc, cur) => acc + cur.dps() , 0);
  }
}
