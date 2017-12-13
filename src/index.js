'use strict';

const Encounter = require('./encounter');
const fs = require('fs');
const SmartBuffer = require('smart-buffer').SmartBuffer;

module.exports = function(filename) {
	fs.readFile(filename, (err, data) => {
		if (err) throw err;

		const logBuffer = SmartBuffer.fromBuffer(data);

		const buildVersion = logBuffer.readString(12);
		logBuffer.readOffset += 1;
		const bossInstanceId = logBuffer.internalBuffer.readUIntLE(logBuffer.readOffset, 2);
		logBuffer.readOffset += 2 + 1;

		const encounter = new Encounter(buildVersion, bossInstanceId);

		const playerCount = logBuffer.internalBuffer.readUIntLE(logBuffer.readOffset, 4);
		logBuffer.readOffset += 4;;

		for (let i = 0; i < playerCount; i++) {

		}
	});
};
