import Agent from "agent/agent";
import PlayerAgent from "agent/player";
import BossAgent from "agent/boss";
const client = require("gw2api-client").default;

const api = client();

module.exports = class AgentFactory {
  constructor() {}

  static async create(properties) {
    if (properties.isElite != 0xffffffff) {
      return api
        .specializations()
        .get(properties.isElite)
        .then(specialization => {
          return new PlayerAgent(properties, specialization);
        })
        .catch(err => {
          return new PlayerAgent(properties);
        });
    } else {
      return new Agent(properties);
    }
  }
};
