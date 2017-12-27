const SmartBuffer = require('smart-buffer').SmartBuffer;

module.exports = class SmarterBuffer extends SmartBuffer {
  constructor(options) {
    super(options)

    const _stack = []

    this.push_offset = function() {
      _stack.push(this.readOffset);
    };

    this.pop_offset = function() {
      this.readOffset = _stack.pop();
    };
  }

  skip(numBytes) {
    this.readOffset += numBytes;
  }

  readUIntLE(numBytes) {
    const num = this.internalBuffer.readUIntLE(this.readOffset, numBytes);
    this.skip(numBytes);
    return num;
  }

  readString(numBytes) {
    return super.readString(numBytes).replace(/\0+$/, '');;
  }

  static fromBuffer(buff, encoding) {
    return new SmarterBuffer({
      buff: buff,
      encoding: encoding
    });
  }
}
