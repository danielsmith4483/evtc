const Skill = require('./skill');

module.exports = class SkillFactory {
  static async create(properties) {
    return new Skill(properties);
  }
}
