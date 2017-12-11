'use strict';
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

		const playerCount = logBuffer.readUInt8();

		console.log(buildVersion);
		console.log(bossInstanceId);
		console.log(playerCount);
	});
};
