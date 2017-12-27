require('babel-polyfill');
var evtc = require('./lib/index.js');

//const encounter = evtc.fromFile('../20171002-210432.evtc');
const encounter = evtc.fromUrl("https://storage.googleapis.com/logwars2-default/20171211-230356.evtc.zip");
