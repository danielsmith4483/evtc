const Agent = require('./agent');
const PlayerAgent = require('./player');
const client = require('gw2api-client').default;

const api = client();

module.exports = class AgentFactory {
	static async create(properties) {
		if (properties.isElite != 0xffffffff) {
			console.log(properties.isElite);
			await api.specializations().get(properties.isElite);
			return new PlayerAgent(properties, api);
		} else {
			return new Agent(properties);
		}
	}
}
