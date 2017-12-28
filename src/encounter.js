const Squad = require("./squad");

module.exports = class Encounter {
  constructor(logBuffer) {
    this.logBuffer = logBuffer;

    this.squad = new Squad();
  }
};
