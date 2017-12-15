const Agent = require('./agent');
const PlayerAgent = require('./player');
const client = require('gw2api-client');

const api = client();

module.exports = class AgentFactory {
	static create(properties) {
		return new Promise(resolve => {
			if (properties.isElite != 0xffffffff) {
				const items = await api().specializations.get(property.isElite);
				console.log(items);
				resolve(new PlayerAgent(properties, api));
			} else {
				resolve(new Agent(properties));
			}
		});
	}
}
