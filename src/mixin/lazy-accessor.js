import { mix } from "mixin/mixin";

let LazyAccessorMixin = superclass =>
  class extends superclass {
    getAsync(propertyName, ifUninitialized) {
      return (() => {
        return new Promise((resolve, reject) => {
          const propertyKey = `_${propertyName}`;

          if (!this.hasOwnProperty(propertyKey)) {
            const propertyValue = ifUninitialized();
            this[propertyKey] = propertyValue;
          }
          resolve(this[propertyKey]);
        });
      })();
    }
  };

export { mix, LazyAccessorMixin };
