module.exports = class Agent {
	constructor(properties) {
		this.agentId = properties.agentId;
		this.profession = properties.profession
		this.isElite = properties.isElite
		this.toughness = properties.toughness;
		this.healing = properties.healing;
		this.condition = properties.condition;
		this.name = properties.name;
	}

	dps() {
		return 5;
	}
}
