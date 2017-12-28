const Squad = require("./squad");

module.exports = class Encounter {
  constructor(logBuffer) {
    this.logBuffer = logBuffer;
  }

  async buildVersion() {
    return "";
  }

  async bossInstanceId() {
    return 0;
  }

  async bossKilled() {
    return false;
  }
};
