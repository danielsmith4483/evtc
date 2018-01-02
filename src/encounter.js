const Squad = require("./squad");

import { mix, LazyAccessorMixin } from "mixin/lazy-accessor";

import AgentFactory from "agent/factory";
import SkillFactory from "skill/factory";
import CombatEventFactory from "combat-event/factory";
import StateChangeEvent from "combat-event/state-change";

import moment from "moment";

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
  },
  skillCount: {
    key: Symbol("skillCount"),
    bytes: 4
  },
  skills: {
    key: Symbol("skills"),
    bytes: 68
  },
  combatEvents: {
    key: Symbol("combatEvents"),
    bytes: 64
  }
};

module.exports = class Encounter extends mix().with(LazyAccessorMixin) {
  constructor(logBuffer) {
    super(logBuffer);

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

    this.logBuffer.setBookmark(bookmarks.skillCount.key);
    this.skillCount = this.logBuffer.readUIntLE(bookmarks.skillCount.bytes);

    this.logBuffer.setBookmark(bookmarks.skills.key);
    this.logBuffer.skip(bookmarks.skills.bytes * this.skillCount);

    this.logBuffer.setBookmark(bookmarks.combatEvents.key);

    this.combatEventCount =
      this.logBuffer.remaining() / bookmarks.combatEvents.bytes;
  }

  async buildVersion() {
    return this.getAsync("buildVersion", () => {
      this.logBuffer.useBookmark(bookmarks.buildVersion.key);
      return this.logBuffer.readString(bookmarks.buildVersion.bytes);
    }).then(buildVersion => buildVersion);
  }

  async targetSpeciesId() {
    return this.getAsync("targetSpeciesId", () => {
      this.logBuffer.useBookmark(bookmarks.targetSpeciesId.key);
      return this.logBuffer.readUIntLE(bookmarks.targetSpeciesId.bytes);
    }).then(targetSpeciesId => targetSpeciesId);
  }

  async agents(agentType) {
    return this.getAsync("agents", () => {
      return this.targetSpeciesId().then(targetSpeciesId => {
        AgentFactory.init(targetSpeciesId);

        this.logBuffer.useBookmark(bookmarks.agents.key);

        const agentPromises = [];

        for (let i = 0; i < this.agentCount; i++) {
          this.logBuffer.useBookmark(bookmarks.agents.key);
          this.logBuffer.skip(bookmarks.agents.bytes * i);

          agentPromises.push(
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

        return Promise.all(agentPromises);
      });
    }).then(agents => {
      if (agentType) {
        return agents.filter(agent => agent[agentType]);
      }
      return agents;
    });
  }

  async boss() {
    return this.getAsync("boss", () => {
      return this.agents("isBoss").then(agents => agents[0]);
    }).then(boss => boss);
  }

  async squad() {
    return this.getAsync("squad", () => {
      return this.agents("isPlayer").then(players => new Squad(players));
    }).then(squad => squad);
  }

  async skills() {
    return this.getAsync("skills", () => {
      this.logBuffer.useBookmark(bookmarks.skills.key);

      const skillPromises = [];

      for (let i = 0; i < this.skillCount; i++) {
        this.logBuffer.useBookmark(bookmarks.skills.key);
        this.logBuffer.skip(bookmarks.skills.bytes * i);

        skillPromises.push(
          SkillFactory.create({
            skillId: this.logBuffer.readUIntLE(4),
            name: this.logBuffer.readString(64)
          })
        );
      }
      return Promise.all(skillPromises);
    }).then(skills => skills);
  }

  async combatEvents(combatEventType) {
    return this.getAsync("combatEvents", () => {
      this.logBuffer.useBookmark(bookmarks.combatEvents.key);

      const combatEventPromises = [];

      for (let i = 0; i < this.combatEventCount; i++) {
        this.logBuffer.useBookmark(bookmarks.combatEvents.key);
        this.logBuffer.skip(bookmarks.combatEvents.bytes * i);

        combatEventPromises.push(
          CombatEventFactory.create({
            time: this.logBuffer.readUIntLE(8),
            srcAgent: this.logBuffer.readUIntLE(8),
            dstAgent: this.logBuffer.readUIntLE(8),
            value: this.logBuffer.readUIntLE(4),
            buffDamage: this.logBuffer.readUIntLE(4),
            overstackValue: this.logBuffer.readUIntLE(2),
            skillId: this.logBuffer.readUIntLE(2),
            srcInstId: this.logBuffer.readUIntLE(2),
            dstInstId: this.logBuffer.readUIntLE(2),
            srcMasterInstId: this.logBuffer.readUIntLE(2),
            ff: this.logBuffer.skip(9).readUIntLE(1),
            buff: this.logBuffer.readUIntLE(1),
            result: this.logBuffer.readUIntLE(1),
            isActivation: this.logBuffer.readUIntLE(1),
            isBuffRemove: this.logBuffer.readUIntLE(1),
            isNinety: this.logBuffer.readUIntLE(1),
            isFifty: this.logBuffer.readUIntLE(1),
            isMoving: this.logBuffer.readUIntLE(1),
            isStateChange: this.logBuffer.readUIntLE(1),
            isFlanking: this.logBuffer.readUIntLE(1)
          })
        );
      }
      return Promise.all(combatEventPromises);
    }).then(combatEvents => {
      if (combatEventType) {
        return combatEvents.filter(combatEvent => combatEvent[combatEventType]);
      }
      return combatEvents;
    });
  }

  async startTime() {
    return this.getAsync("startTime", () => {
      return this.combatEvents("isStateChange").then(combatEvents => {
        const logStartEvent = combatEvents.find(e => {
          return e.isStateChange === StateChangeEvent.stateChangeEnum.logStart;
        });
        return moment.unix(logStartEvent.value);
      });
    }).then(startTime => startTime);
  }

  async endTime() {
    return this.getAsync("endTime", () => {
      return this.combatEvents("isStateChange").then(combatEvents => {
        const logEndEvent = combatEvents.find(e => {
          return e.isStateChange === StateChangeEvent.stateChangeEnum.logEnd;
        });
        return moment.unix(logEndEvent.value);
      });
    }).then(endTime => endTime);
  }

  async bossKilled() {
    return this.getAsync("bossKilled", () => {
      return this.combatEvents("isStateChange").then(combatEvents => {
        return this.boss().then(boss => {
          return combatEvents.some(combatEvent => {
            return boss.agentId === combatEvent.srcAgent;
          });
        });
      });
    }).then(bossKilled => bossKilled);
  }
};
