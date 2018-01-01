import { mix } from "mixin/mixin";

let LazyAccessorMixin = superclass =>
  class extends superclass {
    getAsync(curry) {
      return propertyName => {
        return new Promise((resolve, reject) => {
          const propertyKey = `_${propertyName}`;

          if (!this.hasOwnProperty(propertyKey)) {
            const propertyValue = curry();
            this[propertyKey] = propertyValue;
          }
          resolve(this[propertyKey]);
        });
      };
    }
  };

export { mix, LazyAccessorMixin };
