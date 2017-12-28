const Agent = require("./agent");

module.exports = class BossAgent extends Agent {
  constructor(properties) {
    super(properties);
  }

  isBoss() {
    return true;
  }
};
