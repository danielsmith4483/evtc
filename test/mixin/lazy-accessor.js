import { assert } from "chai";
import { mix, LazyAccessorMixin } from "mixin/lazy-accessor";

describe.only("Lazy Accessor", () => {
  let Base = class Base {};

  let Subclass = class Subclass extends mix(Base).with(LazyAccessorMixin) {
    async hello() {
      const getAsync = this.getAsync(() => {
        let value = null;
        for (let i = 0; i < 100000; i++) {
          value = "hello world";
        }
        return value;
      });

      return getAsync.then(hello => {
        return hello;
      });
    }
  };
  let subclass = null;

  beforeEach(function() {
    subclass = new Subclass();
  });

  it("should not initially contain an accessor's underlying property", function() {
    assert.isFalse(subclass.hasOwnProperty("_hello"));
  });

  it("should return the expected value upon first retrieval", function(done) {
    subclass
      .hello()
      .then(hello => {
        assert.equal(hello, "hello world");
        done();
      })
      .catch(done);
  });
});
