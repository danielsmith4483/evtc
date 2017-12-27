require('babel-polyfill');
var evtc = require('./lib/index.js');
console.log(evtc);

const encounter = evtc.fromFile('../20171002-210432.evtc');
