const Squad = require("./squad");
import AgentFactory from "agent/factory";

const bookmarks = {
  buildVersion: {
    key: Symbol("buildVersion"),
    bytes: 12
  },
  targetSpeciesId: {
    key: Symbol("targetSpeciesId"),
    bytes: 2
  },
  agentCount: {
    key: Symbol("agentCount"),
    bytes: 4
  },
  agents: {
    key: Symbol("agents"),
    bytes: 96
  }
};

module.exports = class Encounter {
  constructor(logBuffer) {
    this.logBuffer = logBuffer;

    this.logBuffer.setBookmark(bookmarks.buildVersion.key);
    this.logBuffer.skip(bookmarks.buildVersion.bytes);

    this.logBuffer.skip(1); // garbage

    this.logBuffer.setBookmark(bookmarks.targetSpeciesId.key);
    this.logBuffer.skip(bookmarks.targetSpeciesId.bytes);

    this.logBuffer.skip(1); // garbage

    this.logBuffer.setBookmark(bookmarks.agentCount.key);
    this.agentCount = this.logBuffer.readUIntLE(bookmarks.agentCount.bytes);

    this.logBuffer.setBookmark(bookmarks.agents.key);
    this.logBuffer.skip(bookmarks.agents.bytes * this.agentCount);
  }

  async buildVersion() {
    if (!this.hasOwnProperty("buildVersion")) {
      this.logBuffer.useBookmark(bookmarks.buildVersion.key);
      this.buildVersion = this.logBuffer.readString(
        bookmarks.buildVersion.bytes
      );
    }

    return this.buildVersion;
  }

  async targetSpeciesId() {
    if (!this.hasOwnProperty("targetSpeciesId")) {
      this.logBuffer.useBookmark(bookmarks.targetSpeciesId.key);
      this.targetSpeciesId = this.logBuffer.readUIntLE(
        bookmarks.targetSpeciesId.bytes
      );
    }

    return this.targetSpeciesId;
  }

  *agents(agentType) {
    if (!this.hasOwnProperty("agents")) {
      this.agents = [];
      this.logBuffer.useBookmark(bookmarks.agents.key);
    }
    for (let i = 0; i < this.agentCount; i++) {
      if (this.agents.length <= i) {
        this.logBuffer.useBookmark(bookmarks.agents.key);
        this.logBuffer.skip(bookmarks.agents.bytes * i);

        this.agents.push(
          AgentFactory.create({
            agentId: this.logBuffer.readUIntLE(8),
            profession: this.logBuffer.readUIntLE(4),
            isElite: this.logBuffer.readUIntLE(4),
            toughness: this.logBuffer.readUIntLE(4),
            healing: this.logBuffer.readUIntLE(4),
            condition: this.logBuffer.readUIntLE(4),
            name: this.logBuffer.readString(68)
          })
        );
      }

      if (agentType) {
        if (this.agents[i].hasOwnProperty(agentType)) {
          yield this.agents[i];
        }
      } else {
        yield this.agents[i];
      }
    }
  }

  async bossName() {
    return null;
  }

  async bossKilled() {
    return false;
  }
};
