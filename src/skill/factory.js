const Skill = require('./skill');

module.exports = class SkillFactory {
  constructor() {}

  static async create(properties) {
    return new Skill(properties);
  }
}
