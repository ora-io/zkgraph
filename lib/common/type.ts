// zkWASM friendly and Subgraph equivalent AssemblyScript API for zkGraph:
// (https://thegraph.com/docs/en/developing/assemblyscript-api/)
// Reference Implementation:
// (https://github.com/graphprotocol/graph-tooling/tree/main/packages/ts)
import * as typeConversion from "../utils/conversion";
import * as bigInt from "../utils/bigInt";

// used in asc to rm env.abort
function abort(a: usize, b: usize, c: u32, d: u32): void {}
export class Event {
  constructor(
    public address: Bytes,
    public esig: Bytes,
    public topic1: Bytes,
    public topic2: Bytes,
    public topic3: Bytes,
    public data: Bytes,
  ) {}
}

/**
 * dereference helper
 *
 * Try not to use this.
 *
 * It's a custom implementation to get the initial Hyper Oracle MVP.
 */
export class PtrDeref {
  data: usize = 0;
  static read(ptr: usize): usize {
    return changetype<PtrDeref>(ptr).data;
  }
  static write(ptr: usize, val: usize): void {
    changetype<PtrDeref>(ptr).data = val;
  }
}

/**
 * Caution! use only if you know what you want to do, otherwise it will introduce weird bug (bus error, runtime err etc.)
 */
let _available_ptr: usize = 60000; // in js local: max mem size == 65535 (guess)
function _static_alloc(_len: usize): usize {
  var _pre_ptr = _available_ptr;
  _available_ptr += _len;
  return _pre_ptr;
}

/**
 * ByteArray Class
 */
export class ByteArray extends Uint8Array {
  /**
   * Returns bytes in little-endian order.
   *
   * Note: Ethereum uses big-endian order.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 67 lines of wat.
   */
  static fromI32(x: i32): ByteArray {
    const self = new ByteArray(4);
    self[0] = x as u8;
    self[1] = (x >> 8) as u8;
    self[2] = (x >> 16) as u8;
    self[3] = (x >> 24) as u8;
    return self;
  }

  /**
   * Returns bytes in big-endian order.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 67 lines of wat.
   */
  static fromI32BigEndian(x: i32): ByteArray {
    const self = new ByteArray(4);
    self[3] = x as u8;
    self[2] = (x >> 8) as u8;
    self[1] = (x >> 16) as u8;
    self[0] = (x >> 24) as u8;
    return self;
  }

  /**
   * Returns bytes in little-endian order.
   *
   * Note: Ethereum uses big-endian order.
   * If your input is big-endian, call `.reverse()` first.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 67 lines of wat.
   */
  static fromU32(x: u32): ByteArray {
    const self = new ByteArray(4);
    self[0] = x as u8;
    self[1] = (x >> 8) as u8;
    self[2] = (x >> 16) as u8;
    self[3] = (x >> 24) as u8;
    return self;
  }

  /**
   * Returns bytes in big-endian order.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 67 lines of wat.
   */
  static fromU32BigEndian(x: u32): ByteArray {
    const self = new ByteArray(4);
    self[3] = x as u8;
    self[2] = (x >> 8) as u8;
    self[1] = (x >> 16) as u8;
    self[0] = (x >> 24) as u8;
    return self;
  }

  /**
   * Returns bytes in little-endian order.
   *
   * Note: Ethereum uses big-endian order.
   * If your input is big-endian, call `.reverse()` first.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 111 lines of wat.
   */
  static fromI64(x: i64): ByteArray {
    const self = new ByteArray(8);
    self[0] = x as u8;
    self[1] = (x >> 8) as u8;
    self[2] = (x >> 16) as u8;
    self[3] = (x >> 24) as u8;
    self[4] = (x >> 32) as u8;
    self[5] = (x >> 40) as u8;
    self[6] = (x >> 48) as u8;
    self[7] = (x >> 56) as u8;
    return self;
  }

  /**
   * Returns bytes in big-endian order.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 111 lines of wat.
   */
  static fromI64BigEndian(x: i64): ByteArray {
    const self = new ByteArray(8);
    self[7] = x as u8;
    self[6] = (x >> 8) as u8;
    self[5] = (x >> 16) as u8;
    self[4] = (x >> 24) as u8;
    self[3] = (x >> 32) as u8;
    self[2] = (x >> 40) as u8;
    self[1] = (x >> 48) as u8;
    self[0] = (x >> 56) as u8;
    return self;
  }

  /**
   * Returns bytes in little-endian order.
   *
   * Note: Ethereum uses big-endian order.
   * If your input is big-endian, call `.reverse()` first.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 111 lines of wat.
   */
  static fromU64(x: u64): ByteArray {
    const self = new ByteArray(8);
    self[0] = x as u8;
    self[1] = (x >> 8) as u8;
    self[2] = (x >> 16) as u8;
    self[3] = (x >> 24) as u8;
    self[4] = (x >> 32) as u8;
    self[5] = (x >> 40) as u8;
    self[6] = (x >> 48) as u8;
    self[7] = (x >> 56) as u8;
    return self;
  }

  /**
   * Returns bytes in big-endian order.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 111 lines of wat.
   */
  static fromU64BigEndian(x: u64): ByteArray {
    const self = new ByteArray(8);
    self[7] = x as u8;
    self[6] = (x >> 8) as u8;
    self[5] = (x >> 16) as u8;
    self[4] = (x >> 24) as u8;
    self[3] = (x >> 32) as u8;
    self[2] = (x >> 40) as u8;
    self[1] = (x >> 48) as u8;
    self[0] = (x >> 56) as u8;
    return self;
  }

  /**
   * Returns empty ByteArray.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 67 lines of wat.
   */
  static empty(): ByteArray {
    return ByteArray.fromI32(0);
  }

  /**
   * Convert the string `hex` which must consist of an even number of
   * hexadecimal digits to a `ByteArray`. The string `hex` can optionally
   * start with '0x'
   *
   * Provable on zkWASM.
   *
   * WASM cost: 1396 lines of wat. //TODO: update this
   */
  static fromHexString(hex: string): ByteArray {
    // assert(hex.length % 2 == 0, "input has odd length");
    // Skip possible `0x` prefix.
    if (hex.length >= 2 && hex.charAt(0) == "0" && hex.charAt(1) == "x") {
      hex = hex.substr(2);
    }

    // padding prefix 0 when odd len
    if (hex.length % 2 != 0) hex = '0'+hex

    const output = new Bytes(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      // @deprecated — Converts a string to an integer of this type. Please use "i32.parse" method.
      // The .wat diff is using I8.parseInt has an additional i32.extend8_s (Unknown opcode 192 (0xC0) in zkwasm).
      // output[i / 2] = I8.parseInt(hex.substr(i, 2), 16);

      // ERROR TS2339: Property 'parse' does not exist on type '~lib/builtins/i32'.
      // output[i / 2] = i32.parse(hex.substr(i, 2), 16);

      // @deprecated — Converts a string to an integer of this type. Please use "i32.parse" method.
      output[i / 2] = I32.parseInt(hex.substr(i, 2), 16);
    }
    return output;
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 275 lines of wat.
   */
  static fromUTF8(str: string): ByteArray {
    const utf8 = String.UTF8.encode(str);
    return changetype<ByteArray>(ByteArray.wrap(utf8));
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 0 lines of wat.
   */
  static fromBigInt(bigInt: BigInt): ByteArray {
    return changetype<ByteArray>(bigInt);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 1121 lines of wat.
   */
  toHex(): string {
    return typeConversion.bytesToHex(this);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 1121 lines of wat.
   */
  toHexString(): string {
    return typeConversion.bytesToHex(this);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 951 lines of wat.
   */
  toString(): string {
    return typeConversion.bytesToString(this);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 421 lines of wat.
   */
  toBase58(): string {
    return typeConversion.bytesToBase58(this);
  }

  /**
   * Interprets the byte array as a little-endian U32.
   * Throws in case of overflow.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 241 lines of wat.
   */
  toU32(): u32 {
    for (let i = 4; i < this.length; i++) {
      if (this[i] != 0) {
        assert(false, "overflow converting this to u32");
      }
    }
    const paddedBytes = new Bytes(4);
    paddedBytes[0] = 0;
    paddedBytes[1] = 0;
    paddedBytes[2] = 0;
    paddedBytes[3] = 0;
    const minLen =
      paddedBytes.length < this.length ? paddedBytes.length : this.length;
    for (let i = 0; i < minLen; i++) {
      paddedBytes[i] = this[i];
    }
    let x: u32 = 0;
    x = (x | paddedBytes[3]) << 8;
    x = (x | paddedBytes[2]) << 8;
    x = (x | paddedBytes[1]) << 8;
    x = x | paddedBytes[0];
    return x;
  }

  /**
   * Interprets the byte array as a big-endian U32.
   * Throws in case of overflow.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 198 lines of wat.
   */
  toU32BigEndian(): u32 {
    for (let i = 0; i < this.length - 4; i++) {
      if (this[i] != 0) {
        assert(false, "overflow converting this to u32");
      }
    }
    const paddedBytes = new Bytes(4);
    paddedBytes[0] = 0;
    paddedBytes[1] = 0;
    paddedBytes[2] = 0;
    paddedBytes[3] = 0;
    const minLen =
      paddedBytes.length < this.length ? paddedBytes.length : this.length;
    for (let i = 0; i < minLen; i++) {
      paddedBytes[i] = this[i];
    }
    let x: u32 = 0;
    x = (x | paddedBytes[0]) << 8;
    x = (x | paddedBytes[1]) << 8;
    x = (x | paddedBytes[2]) << 8;
    x = x | paddedBytes[3];
    return x;
  }

  /**
   * Interprets the byte array as a little-endian I32.
   * Throws in case of overflow.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 230 lines of wat.
   */
  toI32(): i32 {
    const isNeg = this.length > 0 && this[this.length - 1] >> 7 == 1;
    const padding = isNeg ? 255 : 0;
    for (let i = 4; i < this.length; i++) {
      if (this[i] != padding) {
        assert(false, "overflow converting this to i32");
      }
    }
    const paddedBytes = new Bytes(4);
    paddedBytes[0] = padding;
    paddedBytes[1] = padding;
    paddedBytes[2] = padding;
    paddedBytes[3] = padding;
    const minLen =
      paddedBytes.length < this.length ? paddedBytes.length : this.length;
    for (let i = 0; i < minLen; i++) {
      paddedBytes[i] = this[i];
    }
    let x: i32 = 0;
    x = (x | paddedBytes[3]) << 8;
    x = (x | paddedBytes[2]) << 8;
    x = (x | paddedBytes[1]) << 8;
    x = x | paddedBytes[0];
    return x;
  }

  /**
   * Interprets the byte array as a big-endian I32.
   * Throws in case of overflow.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 222 lines of wat.
   */
  toI32BigEndian(): i32 {
    const isNeg = this.length > 0 && this[0] >> 7 == 1;
    const padding = isNeg ? 255 : 0;
    for (let i = 0; i < this.length - 4; i++) {
      if (this[i] != padding) {
        assert(false, "overflow converting to this i32");
      }
    }
    const paddedBytes = new Bytes(4);
    paddedBytes[0] = padding;
    paddedBytes[1] = padding;
    paddedBytes[2] = padding;
    paddedBytes[3] = padding;
    const minLen =
      paddedBytes.length < this.length ? paddedBytes.length : this.length;
    for (let i = 0; i < minLen; i++) {
      paddedBytes[i] = this[i];
    }
    let x: i32 = 0;
    x = (x | paddedBytes[0]) << 8;
    x = (x | paddedBytes[1]) << 8;
    x = (x | paddedBytes[2]) << 8;
    x = x | paddedBytes[3];
    return x;
  }

  /** Create a new `ByteArray` that consist of `this` directly followed by
   * the bytes from `other`
   *
   * Provable on zkWASM.
   *
   * WASM cost: 917 lines of wat.
   */
  concat(other: ByteArray): ByteArray {
    const newArray = new ByteArray(this.length + other.length);
    newArray.set(this, 0);
    newArray.set(other, this.length);
    return newArray;
  }

  /** Create a new `ByteArray` that consists of `this` directly followed by
   * the representation of `other` as bytes
   *
   * Provable on zkWASM.
   *
   * WASM cost: 928 lines of wat.
   */
  concatI32(other: i32): ByteArray {
    return this.concat(ByteArray.fromI32(other));
  }

  /**
   * Interprets the byte array as a little-endian I64.
   * Throws in case of overflow.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 325 lines of wat.
   */
  toI64(): i64 {
    const isNeg = this.length > 0 && this[this.length - 1] >> 7 == 1;
    const padding = isNeg ? 255 : 0;
    for (let i = 8; i < this.length; i++) {
      if (this[i] != padding) {
        assert(false, "overflow converting to this i64");
      }
    }
    const paddedBytes = new Bytes(8);
    paddedBytes[0] = padding;
    paddedBytes[1] = padding;
    paddedBytes[2] = padding;
    paddedBytes[3] = padding;
    paddedBytes[4] = padding;
    paddedBytes[5] = padding;
    paddedBytes[6] = padding;
    paddedBytes[7] = padding;
    const minLen =
      paddedBytes.length < this.length ? paddedBytes.length : this.length;
    for (let i = 0; i < minLen; i++) {
      paddedBytes[i] = this[i];
    }
    let x: i64 = 0;
    x = (x | paddedBytes[7]) << 8;
    x = (x | paddedBytes[6]) << 8;
    x = (x | paddedBytes[5]) << 8;
    x = (x | paddedBytes[4]) << 8;
    x = (x | paddedBytes[3]) << 8;
    x = (x | paddedBytes[2]) << 8;
    x = (x | paddedBytes[1]) << 8;
    x = x | paddedBytes[0];
    return x;
  }

  /**
   * Interprets the byte array as a big-endian I64.
   * Throws in case of overflow.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 317 lines of wat.
   */
  toI64BigEndian(): i64 {
    const isNeg = this.length > 0 && this[0] >> 7 == 1;
    const padding = isNeg ? 255 : 0;
    for (let i = 0; i < this.length - 8; i++) {
      if (this[i] != padding) {
        assert(false, "overflow converting this to i64");
      }
    }
    const paddedBytes = new Bytes(8);
    paddedBytes[0] = padding;
    paddedBytes[1] = padding;
    paddedBytes[2] = padding;
    paddedBytes[3] = padding;
    paddedBytes[4] = padding;
    paddedBytes[5] = padding;
    paddedBytes[6] = padding;
    paddedBytes[7] = padding;
    const minLen =
      paddedBytes.length < this.length ? paddedBytes.length : this.length;
    for (let i = 0; i < minLen; i++) {
      paddedBytes[i] = this[i];
    }
    let x: i64 = 0;
    x = (x | paddedBytes[0]) << 8;
    x = (x | paddedBytes[1]) << 8;
    x = (x | paddedBytes[2]) << 8;
    x = (x | paddedBytes[3]) << 8;
    x = (x | paddedBytes[4]) << 8;
    x = (x | paddedBytes[5]) << 8;
    x = (x | paddedBytes[6]) << 8;
    x = x | paddedBytes[7];
    return x;
  }

  /**
   * Interprets the byte array as a little-endian U64.
   * Throws in case of overflow.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 293 lines of wat.
   */
  toU64(): u64 {
    for (let i = 8; i < this.length; i++) {
      if (this[i] != 0) {
        assert(false, "overflow converting this to u64");
      }
    }
    const paddedBytes = new Bytes(8);
    paddedBytes[0] = 0;
    paddedBytes[1] = 0;
    paddedBytes[2] = 0;
    paddedBytes[3] = 0;
    paddedBytes[4] = 0;
    paddedBytes[5] = 0;
    paddedBytes[6] = 0;
    paddedBytes[7] = 0;
    const minLen =
      paddedBytes.length < this.length ? paddedBytes.length : this.length;
    for (let i = 0; i < minLen; i++) {
      paddedBytes[i] = this[i];
    }
    let x: u64 = 0;
    x = (x | paddedBytes[7]) << 8;
    x = (x | paddedBytes[6]) << 8;
    x = (x | paddedBytes[5]) << 8;
    x = (x | paddedBytes[4]) << 8;
    x = (x | paddedBytes[3]) << 8;
    x = (x | paddedBytes[2]) << 8;
    x = (x | paddedBytes[1]) << 8;
    x = x | paddedBytes[0];
    return x;
  }

  /**
   * Interprets the byte array as a big-endian U64.
   * Throws in case of overflow.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 293 lines of wat.
   */
  toU64BigEndian(): u64 {
    for (let i = 0; i < this.length - 8; i++) {
      if (this[i] != 0) {
        assert(false, "overflow converting this to u64");
      }
    }
    const paddedBytes = new Bytes(8);
    paddedBytes[0] = 0;
    paddedBytes[1] = 0;
    paddedBytes[2] = 0;
    paddedBytes[3] = 0;
    paddedBytes[4] = 0;
    paddedBytes[5] = 0;
    paddedBytes[6] = 0;
    paddedBytes[7] = 0;
    const minLen =
      paddedBytes.length < this.length ? paddedBytes.length : this.length;
    for (let i = 0; i < minLen; i++) {
      paddedBytes[i] = this[i];
    }
    let x: u64 = 0;
    x = (x | paddedBytes[0]) << 8;
    x = (x | paddedBytes[1]) << 8;
    x = (x | paddedBytes[2]) << 8;
    x = (x | paddedBytes[3]) << 8;
    x = (x | paddedBytes[4]) << 8;
    x = (x | paddedBytes[5]) << 8;
    x = (x | paddedBytes[6]) << 8;
    x = x | paddedBytes[7];
    return x;
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 52 lines of wat.
   */
  @operator("==")
  equals(other: ByteArray): boolean {
    if (this.length != other.length) {
      return false;
    }
    for (let i = 0; i < this.length; i++) {
      if (this[i] != other[i]) {
        return false;
      }
    }
    return true;
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 52 lines of wat.
   */
  @operator("!=")
  notEqual(other: ByteArray): boolean {
    return !(this == other);
  }
}

/**
 * Bytes class
 * Uint8Array with clean 'new' and fill without memory.fill
 */
export class Bytes extends ByteArray {
  // Functions from initial implementations
  // Custom implementations to get the initial Hyper Oracle MVP.
  // -----------------------------------------------------------
  /**
   * Try not to use this.
   *
   * It's a custom implementation to get the initial Hyper Oracle MVP.
   */
  static new(_len: i32): Bytes {
    var _bytes_ptr = _static_alloc(12);
    var _arr_data_ptr = _static_alloc(_len);
    // write data ptr to the 0th, 1st fields of Array<u8>
    PtrDeref.write(_bytes_ptr, _arr_data_ptr);
    PtrDeref.write(_bytes_ptr + 4, _arr_data_ptr);
    PtrDeref.write(_bytes_ptr + 8, _len);
    // _available_ptr += (12+_len)
    // _available_ptr += 2 // just for nop
    var _bytes = changetype<Bytes>(_bytes_ptr);
    // write data len to the 2nd, 3rd fields of Array<u8>, equivalent to .length=_len
    return _bytes;
  }

  /**
   * Try not to use this.
   *
   * It's a custom implementation to get the initial Hyper Oracle MVP.
   */
  static fromRawarrPtr(_arr_heap_ptr: usize, _len: i32): Bytes {
    // var _bytes_ptr = heap.alloc(12); // size of Uint8Array == 3*4 == 12
    var _tmpu8a = new Uint8Array(0);
    // var _bytes_ptr = _static_alloc(12);
    var _bytes_ptr = _tmpu8a.dataStart;
    PtrDeref.write(_bytes_ptr, _arr_heap_ptr);
    PtrDeref.write(_bytes_ptr + 4, _arr_heap_ptr);
    PtrDeref.write(_bytes_ptr + 8, _len);
    return changetype<Bytes>(_bytes_ptr);
  }

  toRawarrPtr(): usize {
    return PtrDeref.read(changetype<usize>(this));
  }

  slice(start: i32, end: i32 = -1): Bytes {
    end = end == -1 ? this.length : end;
    return Bytes.fromUint8Array((this as Uint8Array).slice(start, end));
  }

  /**
   * Try not to use this.
   *
   * It's a custom implementation to get the initial Hyper Oracle MVP.
   */
  _slice(start: i32, end: i32): Bytes {
    if (
      start < 0 ||
      end < 0 ||
      start > this.length ||
      end > this.length ||
      start >= end
    ) {
      return new Bytes(0);
      // throw new Error("Invalid slice parameters");
    }

    const len = end - start;
    var dst = new Bytes(len);
    for (let i: i32 = 0; i < len; i++) {
      dst[i] = this[start + i];
    }

    return dst;
  }

  // Disabled due to the existence of implementation of ByteArray
  toU32(): u32 {
    assert(this.length <= 4);
    var rst: u32 = 0;
    for (var i = 0; i < min(4, this.length); i++) {
      rst = rst << 8;
      rst += this[i];
    }
    return rst;
  }

  paddingTo(total_length: i32, is_positon_pre: bool=true, paddingChar:u8=0): Bytes{
    if (total_length <= this.length) return this;

    // Prepare padding bytes
    let _padding = new Bytes(total_length - this.length)
    if (paddingChar != 0) { _padding.fill(paddingChar)}
    // Concat
    let rst: ByteArray
    if (is_positon_pre){ // pre-padding
        rst = _padding.concat(this);
    } else { // post-padding
        rst = this.concat(_padding);
    }
    return rst as Bytes;
  }

  // Disabled due to the existence of implementation of ByteArray
  @operator("==")
  __opeq(right: Bytes): bool {
    if (this.length != right.length) {
      // console.log(this.length.toString() + '---' + right.length.toString());
      return false;
    }
    for (var i = 0; i < this.length; i++) {
      if (this[i] != right[i]) {
        return false;
      }
    }
    return true;
  }
  // --------------------------------------

  /**
   *
   * Provable on zkWASM.
   *
   * WASM cost: 0 line of wat.
   */
  static fromByteArray(byteArray: ByteArray): Bytes {
    return changetype<Bytes>(byteArray);
  }

  /**
   *
   * Provable on zkWASM.
   *
   * WASM cost: 0 line of wat.
   */
  static fromUint8Array(uint8Array: Uint8Array): Bytes {
    return changetype<Bytes>(uint8Array);
  }

  /**
   * Convert the string `hex` which must consist of an even number of
   * hexadecimal digits to a `ByteArray`. The string `hex` can optionally
   * start with '0x'
   *
   * Provable on zkWASM.
   *
   * WASM cost: 1396 line of wat.
   */
  static fromHexString(str: string): Bytes {
    return changetype<Bytes>(ByteArray.fromHexString(str));
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 279 line of wat.
   */
  static fromUTF8(str: string): Bytes {
    return Bytes.fromByteArray(ByteArray.fromUTF8(str));
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 67 line of wat.
   */
  static fromI32(i: i32): Bytes {
    return changetype<Bytes>(ByteArray.fromI32(i));
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 67 line of wat.
   */
  static empty(): Bytes {
    return changetype<Bytes>(ByteArray.empty());
  }

  // Disabled for now
  // (ERROR TS2394: This overload signature is not compatible with its implementation signature.)
  // concat(other: Bytes): Bytes {
  //   return changetype<Bytes>(super.concat(other));
  // }

  // concatI32(other: i32): Bytes {
  //   return changetype<Bytes>(super.concat(ByteArray.fromI32(other)));
  // }
}

/** An Ethereum address (20 bytes). */
export class Address extends Bytes {
  /**
   * Provable on zkWASM.
   *
   * WASM cost: 126 line of wat.
   */
  static fromString(s: string): Address {
    return changetype<Address>(typeConversion.stringToH160(s));
  }

  /** Convert `Bytes` that must be exactly 20 bytes long to an address.
   * Passing in a value with fewer or more bytes will result in an error
   *
   * Provable on zkWASM.
   *
   * WASM cost: 9 line of wat.
   */
  static fromBytes(b: Bytes): Address {
    if (b.length != 20) {
      throw new Error(
        // `Bytes of length ${b.length} can not be converted to 20 byte addresses`
        // Don't use ${} in error message for better performance in zkWASM
        `Bytes of length of (not 20) can not be converted to 20 byte addresses`,
      );
    }
    return changetype<Address>(b);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 44 line of wat.
   */
  static zero(): Address {
    const self = new ByteArray(20);

    for (let i = 0; i < 20; i++) {
      self[i] = 0;
    }

    return changetype<Address>(self);
  }
}

/** An arbitrary size integer represented as an array of bytes. */
export class BigInt extends Uint8Array {
  /**
   * Provable on zkWASM.
   *
   * WASM cost: 48 line of wat.
   */
  static fromI32(x: i32): BigInt {
    const byteArray = ByteArray.fromI32(x);
    return BigInt.fromByteArray(byteArray);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 115 line of wat.
   */
  static fromU32(x: u32): BigInt {
    const byteArray = ByteArray.fromU32(x);
    return BigInt.fromUnsignedBytes(byteArray);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 92 line of wat.
   */
  static fromI64(x: i64): BigInt {
    const byteArray = ByteArray.fromI64(x);
    return BigInt.fromByteArray(byteArray);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 159 line of wat.
   */
  static fromU64(x: u64): BigInt {
    const byteArray = ByteArray.fromU64(x);
    return BigInt.fromUnsignedBytes(byteArray);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 48 line of wat.
   */
  static zero(): BigInt {
    return BigInt.fromI32(0);
  }

  /**
   * `bytes` assumed to be little-endian. If your input is big-endian, call `.reverse()` first.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 17 line of wat.
   */
  static fromSignedBytes(bytes: Bytes): BigInt {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const byteArray = <ByteArray>bytes;
    return BigInt.fromByteArray(byteArray);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 150 line of wat.
   */
  static fromSignedBytesBigEndian(bytes: Bytes): BigInt {
    return BigInt.fromSignedBytes(<Bytes>bytes.reverse());
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 17 line of wat.
   */
  static fromByteArray(byteArray: ByteArray): BigInt {
    return changetype<BigInt>(byteArray);
  }

  /**
   * `bytes` assumed to be little-endian. If your input is big-endian, call `.reverse()` first.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 83 line of wat.
   */
  static fromUnsignedBytes(bytes: ByteArray): BigInt {
    const signedBytes = new BigInt(bytes.length + 1);
    for (let i = 0; i < bytes.length; i++) {
      signedBytes[i] = bytes[i];
    }
    signedBytes[bytes.length] = 0;
    return signedBytes;
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 229 line of wat.
   */
  static fromUnsignedBytesBigEndian(bytes: ByteArray): BigInt {
    return BigInt.fromUnsignedBytes(<Bytes>bytes.reverse());
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 1632 line of wat.
   *
   * Lowercase hex string without 0x prefix.
   */
  toHex(): string {
    return typeConversion.bigIntToHex(this);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 1629 line of wat.
   *
   * Converts `BigInt` to a hexadecimal string representation, with an optional
   * prefix (for example, '0x').
   *
   * Notice: The Original AssemblySciprt API of The Graph is without 0x prefix.
   */
  toHexString(prefix: string = ""): string {
    if (prefix !== "") {
      return prefix + typeConversion.bigIntToHex(this);
    }
    return typeConversion.bigIntToHex(this);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 1632 line of wat.
   */
  toString(): string {
    return typeConversion.bigIntToString(this);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 4125 line of wat.
   */
  static fromString(s: string): BigInt {
    return bigInt.fromString(s);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 200 line of wat.
   */
  toI32(): i32 {
    const uint8Array = changetype<Uint8Array>(this);
    const byteArray = changetype<ByteArray>(uint8Array);
    return byteArray.toI32();
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 221 line of wat.
   */
  toU32(): u32 {
    const uint8Array = changetype<Uint8Array>(this);
    const byteArray = changetype<ByteArray>(uint8Array);
    return byteArray.toU32();
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 302 line of wat.
   */
  toI64(): i64 {
    const uint8Array = changetype<Uint8Array>(this);
    const byteArray = changetype<ByteArray>(uint8Array);
    return byteArray.toI64();
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 270 line of wat.
   */
  toU64(): u64 {
    const uint8Array = changetype<Uint8Array>(this);
    const byteArray = changetype<ByteArray>(uint8Array);
    return byteArray.toU64();
  }

  // toBigDecimal(): BigDecimal {
  //   return new BigDecimal(this);
  // }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 303 line of wat.
   */
  isZero(): boolean {
    return this == BigInt.fromI32(0);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 331 line of wat.
   */
  isI32(): boolean {
    return (
      BigInt.fromI32(i32.MIN_VALUE) <= this &&
      this <= BigInt.fromI32(i32.MAX_VALUE)
    );
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 3877 line of wat.
   */
  abs(): BigInt {
    return this < BigInt.fromI32(0) ? this.neg() : this;
  }

  /**
   * Provable on zkWASM (if BigInt less than U64.MAX_VALUE).
   *
   * WASM cost: 5357 line of wat.
   */
  sqrt(): BigInt {
    const x: BigInt = this;

    // Handle negative numbers
    if (x < BigInt.fromI32(0)) {
      throw new Error("cannot sqrt negative number");
    }

    // Handle numbers smaller than U64.MAX_VALUE
    if (x < BigInt.fromU64(U64.MAX_VALUE)) {
      const xU64 = x.toU64();
      // Note: This will add 1 to xU64 then overflow if condition is set to lte.
      let zU64 = (xU64 + 1) / 2;
      let yU64 = xU64;
      while (zU64 < yU64) {
        yU64 = zU64;
        zU64 = (xU64 / zU64 + zU64) / 2;
      }
      return BigInt.fromU64(yU64);
    }

    // Handle numbers larger than U64.MAX_VALUE (the real BigInt)
    let z = x.plus(BigInt.fromI32(1)).div(BigInt.fromI32(2));
    let y = x;
    while (z < y) {
      y = z;
      z = x.div(z).plus(z).div(BigInt.fromI32(2));
    }

    return y;
  }

  // Operators
  /**
   * Provable on zkWASM.
   *
   * WASM cost: 3552 line of wat.
   */
  @operator("+")
  plus(other: BigInt): BigInt {
    // ERROR TS2322: Type 'sdk/type/BigInt | null' is not assignable to type 'sdk/type/BigInt'.
    // assert(
    //   this !== null,
    //   "Failed to sum BigInts because left hand side is 'null'"
    // );
    return bigInt.plus(this, other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 3553 line of wat.
   */
  @operator("-")
  minus(other: BigInt): BigInt {
    // assert(
    //   this !== null,
    //   "Failed to subtract BigInts because left hand side is 'null'"
    // );
    return bigInt.minus(this, other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 3369 line of wat.
   */
  @operator("*")
  times(other: BigInt): BigInt {
    // assert(
    //   this !== null,
    //   "Failed to multiply BigInts because left hand side is 'null'"
    // );
    return bigInt.times(this, other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 4455 line of wat.
   */
  @operator("/")
  div(other: BigInt): BigInt {
    // assert(
    //   this !== null,
    //   "Failed to divide BigInts because left hand side is 'null'"
    // );
    return bigInt.dividedBy(this, other);
  }

  // divDecimal(other: BigDecimal): BigDecimal {
  //   return bigInt.dividedByDecimal(this, other);
  // }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 4438 line of wat.
   */
  @operator("%")
  mod(other: BigInt): BigInt {
    // assert(
    //   this !== null,
    //   "Failed to apply module to BigInt because left hand side is 'null'"
    // );
    return bigInt.mod(this, other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 298 line of wat.
   */
  @operator("==")
  equals(other: BigInt): boolean {
    return BigInt.compare(this, other) == 0;
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 298 line of wat.
   */
  @operator("!=")
  notEqual(other: BigInt): boolean {
    return !(this == other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 298 line of wat.
   */
  @operator("<")
  lt(other: BigInt): boolean {
    return BigInt.compare(this, other) == -1;
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 298 line of wat.
   */
  @operator(">")
  gt(other: BigInt): boolean {
    return BigInt.compare(this, other) == 1;
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 298 line of wat.
   */
  @operator("<=")
  le(other: BigInt): boolean {
    return !(this > other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 298 line of wat.
   */
  @operator(">=")
  ge(other: BigInt): boolean {
    return !(this < other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 3554 line of wat.
   */
  @operator.prefix("-")
  neg(): BigInt {
    return BigInt.fromI32(0).minus(this);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 3753 line of wat.
   */
  @operator("|")
  bitOr(other: BigInt): BigInt {
    return bigInt.bitOr(this, other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 3747 line of wat.
   */
  @operator("&")
  bitAnd(other: BigInt): BigInt {
    return bigInt.bitAnd(this, other);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 2994 line of wat.
   */
  @operator("<<")
  leftShift(bits: u8): BigInt {
    return bigInt.leftShift(this, bits);
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 3190 line of wat.
   */
  @operator(">>")
  rightShift(bits: u8): BigInt {
    return bigInt.rightShift(this, bits);
  }

  /**
   * Limited to a low exponent to discourage creating a huge BigInt.
   *
   * Provable on zkWASM.
   *
   * WASM cost: 4058 line of wat.
   */
  pow(exp: u8): BigInt {
    return bigInt.pow(this, exp);
  }

  /**
   * Returns −1 if a < b, 1 if a > b, and 0 if A == B
   */
  static compare(a: BigInt, b: BigInt): i32 {
    // Check if a and b have the same sign.
    const aIsNeg = a.length > 0 && a[a.length - 1] >> 7 == 1;
    const bIsNeg = b.length > 0 && b[b.length - 1] >> 7 == 1;

    if (!aIsNeg && bIsNeg) {
      return 1;
    }
    if (aIsNeg && !bIsNeg) {
      return -1;
    }

    // Check how many bytes of a and b are relevant to the magnitude.
    let aRelevantBytes = a.length;
    while (
      aRelevantBytes > 0 &&
      ((!aIsNeg && a[aRelevantBytes - 1] == 0) ||
        (aIsNeg && a[aRelevantBytes - 1] == 255))
    ) {
      aRelevantBytes -= 1;
    }
    let bRelevantBytes = b.length;
    while (
      bRelevantBytes > 0 &&
      ((!bIsNeg && b[bRelevantBytes - 1] == 0) ||
        (bIsNeg && b[bRelevantBytes - 1] == 255))
    ) {
      bRelevantBytes -= 1;
    }

    // If a and b are positive then the one with more relevant bytes is larger.
    // Otherwise the one with less relevant bytes is larger.
    if (aRelevantBytes > bRelevantBytes) {
      return aIsNeg ? -1 : 1;
    }
    if (bRelevantBytes > aRelevantBytes) {
      return aIsNeg ? 1 : -1;
    }

    // We now know that a and b have the same sign and number of relevant bytes.
    // If a and b are both negative then the one of lesser magnitude is the
    // largest, however since in two's complement the magnitude is flipped, we
    // may use the same logic as if a and b are positive.
    const relevantBytes = aRelevantBytes;
    for (let i = 1; i <= relevantBytes; i++) {
      if (a[relevantBytes - i] < b[relevantBytes - i]) {
        return -1;
      }
      if (a[relevantBytes - i] > b[relevantBytes - i]) {
        return 1;
      }
    }

    return 0;
  }
}
