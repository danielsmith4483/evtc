'use strict';

const fs = require('fs');
const SmarterBuffer = require('./smarter-buffer');;

const Encounter = require('./encounter');
const AgentFactory = require('./agent/factory');

module.exports = async function(filename) {
	fs.readFile(filename, (err, data) => {
		if (err) throw err;

		const logBuffer = SmarterBuffer.fromBuffer(data);

		const buildVersion = logBuffer.readString(12);

		logBuffer.skip(1);

		const bossInstanceId = logBuffer.readUIntLE(2);

		logBuffer.skip(1);

		const encounter = new Encounter(buildVersion, bossInstanceId);

		const agentCount = logBuffer.readUIntLE(4);

		for (let i = 0; i < agentCount; i++) {
			const agent = await AgentFactory.create({
				agentId: logBuffer.readUIntLE(8),
				profession: logBuffer.readUIntLE(4),
				isElite: logBuffer.readUIntLE(4),
				toughness: logBuffer.readUIntLE(4),
				healing: logBuffer.readUIntLE(4),
				condition: logBuffer.readUIntLE(4),
				name: logBuffer.readString(68)
			});
		}
	});
};
