var evtc = require('./lib/index.js');

evtc.fromFile('../20171002-210432.evtc').catch(err => {
  console.log(err);
});
//const encounter = evtc.fromUrl("https://storage.googleapis.com/logwars2-default/20171211-230356.evtc.zip");

