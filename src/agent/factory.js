const Agent = require('./agent');
const PlayerAgent = require('./player');
const client = require('gw2api-client').default;

const api = client();

module.exports = class AgentFactory {
	static async create(properties) {
		if (properties.isElite != 0xffffffff) {
			return api.specializations().get(properties.isElite)
				.then(specialization => {
					return new PlayerAgent(properties);
				})
				.catch(err => {
					return new PlayerAgent(properties);
				});
		} else {
			return new Agent(properties);
		}
	}
}
