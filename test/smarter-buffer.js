import { assert } from "chai";
import SmarterBuffer from "smarter-buffer";
import { SmartBuffer } from "smart-buffer";

describe("SmarterBuffer", () => {
  let rawBuffer = null;
  let buffer = null;

  beforeEach(function() {
    buffer = new SmarterBuffer(rawBuffer);
  });

  describe("Standard Operations", () => {
    before(function() {
      rawBuffer = new Buffer([1, 2, 3, 4, 5, 6]);
    });

    it("should initialize an internal SmartBuffer instance", () => {
      assert.instanceOf(buffer.smartBuffer, SmartBuffer);
    });

    it("should initialize using SmartBuffer's fromBuffer function", () => {
      buffer = SmarterBuffer.fromBuffer(rawBuffer);
      assert.isNotNull(buffer);
    });

    it("should skip n bytes when skip(n) is called", () => {
      const n = 3;

      const fn = function() {
        buffer.skip(n);
      };

      assert.increasesBy(fn, buffer.smartBuffer, "readOffset", n);
    });

    it("should return the number of remaining bytes", () => {
      assert.equal(buffer.remaining(), buffer.smartBuffer.remaining());
    });
  });

  describe("readUIntLE", () => {
    before(function() {
      rawBuffer = new Buffer([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should read a single byte", () => {
      assert.equal(buffer.readUIntLE(1), 0x1);
    });

    it("should read 2 bytes", () => {
      assert.equal(buffer.readUIntLE(2), 0x201);
    });

    it("should read 4 bytes", () => {
      assert.equal(buffer.readUIntLE(4), 0x4030201);
    });

    it("should read 8 bytes", () => {
      assert.equal(buffer.readUIntLE(8), 0x807060504030201);
    });
  });

  describe("readString", () => {
    before(function() {
      rawBuffer = Buffer.from("Hello World");
    });

    it("should read n bytes of a string", () => {
      const n = 5;
      assert.equal(buffer.readString(n), "Hello");
    });

    it("should read terminate before the end of a string", () => {
      assert.equal(buffer.readString(50), "Hello World");
    });
    it("should strip terminating null characters.", () => {
      buffer = SmarterBuffer.fromBuffer(Buffer.from("Hello World\0\0\0"));
      assert.equal(buffer.readString(50), "Hello World");
    });
  });

  describe("Bookmarks", () => {
    before(function() {
      rawBuffer = new Buffer([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it("should create and retrieve bookmarks with a specified offset", () => {
      buffer.setBookmark("newBookmark", 4);
      assert.equal(buffer.getBookmark("newBookmark"), 4);
    });

    it("should create and retrieve bookmarks at the current offset", () => {
      const currentOffset = buffer.smartBuffer.readOffset;
      buffer.setBookmark("newBookmark");
      assert.equal(buffer.getBookmark("newBookmark"), currentOffset);
    });

    it("should jump to an offset given a bookmark", () => {
      const originalOffset = buffer.smartBuffer.readOffset;
      const n = 4;

      buffer.setBookmark("firstBookmark");
      buffer.skip(n);
      buffer.setBookmark("secondBookmark");

      buffer.useBookmark("firstBookmark");
      assert.equal(buffer.smartBuffer.readOffset, originalOffset);

      buffer.useBookmark("secondBookmark");
      assert.equal(buffer.smartBuffer.readOffset, originalOffset + n);
    });

    it("should throw an error when retrieving nonexistent bookmarks", () => {
      assert.throws(function() {
        buffer.getBookmark("nonexistentBookmark");
      });
    });
  });
});
