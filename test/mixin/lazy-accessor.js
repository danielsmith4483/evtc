import { assert } from "chai";
import { mix, LazyAccessorMixin } from "mixin/lazy-accessor";

describe("Lazy Accessor", () => {
  let Base = class Base {};

  let Subclass = class Subclass extends mix(Base).with(LazyAccessorMixin) {
    async hello() {
      return this.getAsync("hello", () => {
        return "hello world";
      }).then(hello => {
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

  it("should not recompute a property after first retrieval", function(done) {
    subclass
      .hello()
      .then(hello => {
        assert.equal(hello, "hello world");

        subclass._hello = "new value";

        subclass
          .hello()
          .then(hello => {
            assert.equal(hello, "new value");
            done();
          })
          .catch(done);
      })
      .catch(done);
  });
});
