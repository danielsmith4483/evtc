const SmartBuffer = require("smart-buffer").SmartBuffer;

module.exports = class SmarterBuffer {
  constructor(buffer) {
    this.smartBuffer = SmartBuffer.fromBuffer(buffer);

    const bookmarks = {};

    this.setBookmark = function(key, offset = this.smartBuffer.readOffset) {
      bookmarks[key] = offset;
    };

    this.getBookmark = function(key) {
      if (!(key in bookmarks)) {
        throw "Invalid bookmark";
      }
      return bookmarks[key];
    };

    this.useBookmark = function(key) {
      if (!(key in bookmarks)) {
        throw "Invalid bookmark";
      }
      this.smartBuffer.readOffset = bookmarks[key];
    };
  }

  static fromBuffer(buffer) {
    return new this(buffer);
  }

  skip(numBytes) {
    this.smartBuffer.readOffset += numBytes;
    return this;
  }

  readUIntLE(numBytes) {
    const num = this.smartBuffer.internalBuffer.readUIntLE(
      this.smartBuffer.readOffset,
      numBytes
    );
    this.skip(numBytes);
    return num;
  }

  readString(numBytes) {
    return this.smartBuffer.readString(numBytes).replace(/\0+$/, "");
  }

  remaining() {
    return this.smartBuffer.remaining();
   }
};
