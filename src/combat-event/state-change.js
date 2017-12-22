const CombatEvent = require('./combat-event');

module.exports = class StateChangeEvent extends CombatEvent {
  constructor(properties) {
    super(properties);
  }
}
