var evtc = require("./lib/index.js");

const url =
  "https://storage.googleapis.com/logwars2-default/20171211-230356.evtc.zip";

evtc
  .fromUrl(url)
  .then(e => {
    e.buildVersion().then(buildVersion => {
      console.log(buildVersion);
    });
  })
  .catch(err => {
    console.log(err);
  });
