const fs = require("fs");
const SmarterBuffer = require("./smarter-buffer");

const Encounter = require("./encounter");
const AgentFactory = require("./agent/factory");
const SkillFactory = require("./skill/factory");
const CombatEventFactory = require("./combat-event/factory");

const request = require("request").defaults({ encoding: null });

import decompress from "decompress";

async function parse(buffer) {
  const logBuffer = SmarterBuffer.fromBuffer(buffer);

  const encounter = new Encounter(logBuffer);

  return encounter;

  const buildVersion = logBuffer.readString(12);

  logBuffer.skip(1);

  const bossInstanceId = logBuffer.readUIntLE(2);

  logBuffer.skip(1);

  //const encounter = new Encounter(buildVersion, bossInstanceId);

  const agentCount = logBuffer.readUIntLE(4);

  const agents = [];

  for (let i = 0; i < agentCount; i++) {
    agents.push(
      AgentFactory.create({
        agentId: logBuffer.readUIntLE(8),
        profession: logBuffer.readUIntLE(4),
        isElite: logBuffer.readUIntLE(4),
        toughness: logBuffer.readUIntLE(4),
        healing: logBuffer.readUIntLE(4),
        condition: logBuffer.readUIntLE(4),
        name: logBuffer.readString(68)
      })
    );
  }

  Promise.all(agents)
    .then(agents => {
      agents.map(
        agent => agent.characterName && console.log(agent.characterName())
      );
    })
    .catch(err => console.log(err));

  const skillCount = logBuffer.readUIntLE(4);

  for (let i = 0; i < skillCount; i++) {
    SkillFactory.create({
      skillId: logBuffer.readUIntLE(4),
      name: logBuffer.readString(64)
    })
      .then(skill => {
        // do something
      })
      .catch(err => console.log(err));
  }

  while (logBuffer.remaining() >= 68) {
    CombatEventFactory.create({
      time: logBuffer.readUIntLE(8),
      srcAgent: logBuffer.readUIntLE(8),
      dstAgent: logBuffer.readUIntLE(8),
      value: logBuffer.readUIntLE(4),
      buffDamage: logBuffer.readUIntLE(4),
      overstackValue: logBuffer.readUIntLE(2),
      skillId: logBuffer.readUIntLE(2),
      srcInstId: logBuffer.readUIntLE(2),
      dstInstId: logBuffer.readUIntLE(2),
      srcMasterInstId: logBuffer.readUIntLE(2),
      iff: (function() {
        logBuffer.skip(9);
        return logBuffer.readUIntLE(1);
      })(),
      buff: logBuffer.readUIntLE(1),
      result: logBuffer.readUIntLE(1),
      isActivation: logBuffer.readUIntLE(1),
      isBuffRemove: logBuffer.readUIntLE(1),
      isNinety: logBuffer.readUIntLE(1),
      isFifty: logBuffer.readUIntLE(1),
      isMoving: logBuffer.readUIntLE(1),
      isStateChange: logBuffer.readUIntLE(1),
      isFlanking: logBuffer.readUIntLE(1)
    })
      .then(combatEvent => {
        //        console.log(combatEvent.constructor.name);
      })
      .catch(err => console.log(err));

    logBuffer.skip(3);
  }
}

async function fromZip(buffer) {
  return decompress(buffer)
    .then(async files => {
      return files[0].data;
    })
    .catch(async err => {
      console.log(err);
    });
}

export async function fromUrl(url) {
  return request.get(url, async (err, res, body) => {
    fromZip(body).then(async buffer => {
      return parse(buffer);
    });
  });
}

export async function fromFile(filename) {
  return new Promise(resolve => {
    fs.readFile(filename, async (err, data) => {
      if (err) throw err;

      resolve(
        fromZip(data).then(async buffer => {
          return parse(buffer);
        })
      );
    });
  });
}
