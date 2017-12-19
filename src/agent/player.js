const Agent = require('./agent');

module.exports = class PlayerAgent extends Agent {
	constructor(properties) {
		super(properties);
	}

	isPlayer() {
		return true;
	}

	nameComponents() {
		return this.name.split("\0").filter(n => n != "");
	}

	characterName() {
		return this.nameComponents()[0];
	}

	username() {
		return this.nameComponents()[1].slice(1);
	}

	subgroup() {
		return this.nameComponents()[2];
	}
}
