import { mix } from "mixin/mixin";

let LoggableDPSMixin = superclass =>
  class extends superclass {
    constructor(options) {
      super(...options);
    }

    async dps() {
    }
  };

export { mix, LoggableDPSMixin };
