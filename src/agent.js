module.exports = class Agent {
	constructor(agentId, profession, isElite, toughness, healing, condition, name) {
		this.agentId = agentId;
		this.name = name;
		this.toughness = toughness;
		this.healing = healing;
		this.condition = condition;

		if (isElite !== 0xffffffff) {
			console.log(name);
		}
	}
}
