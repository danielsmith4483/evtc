const CombatEvent = require('./combat-event');
const StateChangeEvent = require('./state-change');

module.exports = class CombatEventFactory {
	static async create(properties) {
		if (properties.isStateChange) {
			return new StateChangeEvent(properties);
		}
		return new CombatEvent(properties);
	}
}
