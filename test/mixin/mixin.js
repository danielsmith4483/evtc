import { assert } from "chai";
import { mix } from "mixin/mixin";

describe("MixinBuilder", () => {
  let M1 = null;
  let M2 = null;
  let A = null;
  let B = null;
  let b = null;

  before(function() {
    let A = class A {
      foo() {
        return "foo";
      }

      bar() {
        return "bar";
      }

      baz() {
        return "baz";
      }

      baz2() {
        return "baz2";
      }
    };

    let M1 = superclass =>
      class extends superclass {
        foo2() {
          return "foo2";
        }

        bar2() {
          return "bar2";
        }

        baz3() {
          return "baz3";
        }
      };

    let M2 = superclass =>
      class extends superclass {
        bar() {
          return "baz";
        }

        bar3() {
          return "bar3";
        }

        baz3() {
          return "baz";
        }
      };

    let B = class B extends mix(A).with(M1, M2) {
      foo3() {
        return "foo3";
      }

      baz2() {
        return "baz";
      }

      bar3() {
        return "bar";
      }
    };

    b = new B();
  });

  it("should retain its original properties", function() {
    assert.equal(b.foo3(), "foo3");
  });

  it("should inherit properties from each mixin", function() {
    assert.equal(b.bar2(), "bar2");
    assert.equal(b.foo2(), "foo2");
  });

  it("should inherit properties from the base class", function() {
    assert.equal(b.baz(), "baz");
  });

  it("should overwrite base class properties with mixin properties", function() {
    assert.equal(b.bar(), "baz");
  });

  it("should overwrite base class properties with subclass properties", function() {
    assert.equal(b.baz2(), "baz");
  });

  it("should overwrite mixin properties with subclass properties", function() {
    assert.equal(b.bar3(), "bar");
  });

  it("should overwrite right-to-left when a mixin overwrites a property from another mixin", function() {
    assert.equal(b.baz3(), "baz");
  });
});
