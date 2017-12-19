const Subgroup = require('./subgroup');

module.exports = class Squad {
	constructor() {
		this.subgroups = [];
	}

	addPlayer(player) {
		const subgroup = player.subgroup() - 1;
		if (!this.subgroups[subgroup]) {
			this.subgroups[subgroup] = new Subgroup(player);
		} else {
			this.subgroups[subgroup].addPlayer(player);;
		}
	}

	dps() {
		if (this.subgroups.length === 0) {
			return 0;
		}
		return this.subgroups.reduce((acc, cur) => acc + cur.dps(), 0);
	}
}
