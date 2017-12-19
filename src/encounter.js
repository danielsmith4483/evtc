const Squad = require('./squad');

module.exports = class Encounter {
	constructor(buildVersion, bossInstanceId) {
		this.buildVersion = buildVersion;
		this.bossInstanceId = bossInstanceId;

		this.squad = new Squad();
	}
}
