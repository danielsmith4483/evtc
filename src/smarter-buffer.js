const SmartBuffer = require('smart-buffer').SmartBuffer;

module.exports = class SmarterBuffer {
  constructor(buffer) {
    this.smartBuffer = SmartBuffer.fromBuffer(buffer);
  }

  static fromBuffer(buffer) {
    return new this(buffer);
  }

  skip(numBytes) {
    this.smartBuffer.readOffset += numBytes;
  }

  readUIntLE(numBytes) {
    const num = this.smartBuffer.internalBuffer.readUIntLE(this.readOffset, numBytes);
    this.skip(numBytes);
    return num;
  }

  readString(numBytes) {
    return this.smartBuffer.readString(numBytes).replace(/\0+$/, '');;
  }
}
