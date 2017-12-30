const CombatEvent = require("./combat-event");

module.exports = class StateChangeEvent extends CombatEvent {
  static get stateChangeEnum() {
    return {
      none: 0,
      enterCombat: 1,
      exitCombat: 2,
      changeUp: 3,
      changeDead: 4,
      changeDown: 5,
      spawn: 6,
      despawn: 7,
      healthUpdate: 8,
      logStart: 9,
      logEnd: 10,
      weapSwap: 11,
      maxHealthUpdate: 12,
      pointOfView: 13,
      language: 14,
      gwBuild: 15,
      shardId: 16,
      reward: 17
    };
  }

  constructor(properties) {
    super(properties);

    this.srcAgent = properties.srcAgent;
    this.value = properties.value;
    this.buffDamage = properties.buffDamage;
    this.isStateChange = properties.isStateChange;
  }
};
