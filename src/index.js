'use strict';

const fs = require('fs');
const SmarterBuffer = require('./smarter-buffer');;

const Encounter = require('./encounter');

module.exports = function(filename) {
	fs.readFile(filename, (err, data) => {
		if (err) throw err;

		const logBuffer = SmarterBuffer.fromBuffer(data);

		const buildVersion = logBuffer.readString(12);

		logBuffer.skip(1);

		const bossInstanceId = logBuffer.readUIntLE(2);

		logBuffer.skip(1);

		const encounter = new Encounter(buildVersion, bossInstanceId);

		const agentCount = logBuffer.readUIntLE(4);

		console.log(encounter.buildVersion);
		console.log(encounter.bossInstanceId);
		console.log(agentCount);

		for (let i = 0; i < agentCount; i++) {
			const agent = logBuffer.readUIntLE(8);
			const profession = logBuffer.readUIntLE(4);
			const isElite = logBuffer.readUIntLE(4);
			const toughness = logBuffer.readUIntLE(4);
			const healing = logBuffer.readUIntLE(4);
			const condition = logBuffer.readUIntLE(4);

			const name = logBuffer.readString(68);

			console.log(`agent: ${agent}`);
//			console.log(`profession: ${profession}`);
//			console.log(`isElite: ${isElite}`);
//			console.log(`toughness: ${toughness}`);
//			console.log(`healing: ${healing}`);
//			console.log(`condition: ${condition}`);
			console.log(name);
		}
	});
};
