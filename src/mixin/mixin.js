let mix = superclass => new MixinBuilder(superclass);

class MixinBuilder {
  constructor(superclass = class {}) {
    this.superclass = superclass;
  }

  with(...mixins) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}

export { mix };
