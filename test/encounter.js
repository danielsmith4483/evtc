import { assert } from 'chai';
import Encounter from 'encounter';
import Squad from 'squad';

describe('Encounter', () => {
  describe('constructor', () => {
    const buildVersion = "buildver";
    const instanceId = 1;

    const encounter = new Encounter(buildVersion, instanceId);
    it('should initialize build version', () => {
      assert.equal(encounter.buildVersion, buildVersion);
    });
    it('should initilalize instance ID', () => {
      assert.equal(encounter.bossInstanceId, instanceId);
    });
    it('should initialize the squad object', () => {
      assert.instanceOf(encounter.squad, Squad);
    });
  });
});
