import { mix } from "mixin/mixin";

let LazyAccessorMixin = superclass =>
  class extends superclass {
    async getAsync(curry) {
      return (propertyName => {
        const propertyKey = `_${propertyName}`;

        if (!this.hasOwnProperty(propertyKey)) {
          const propertyValue = curry();
          this[propertyKey] = propertyValue;
        }
        return this[propertyKey];
      })();
    }
  };

export { mix, LazyAccessorMixin };
