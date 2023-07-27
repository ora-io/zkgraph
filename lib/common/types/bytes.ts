import * as typeConversion from "../../utils/conversion";

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
    if (hex.length % 2 != 0) hex = "0" + hex;

    const output = new Bytes(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      // @deprecated — Converts a string to an integer of this type. Please use "i32.parse" method.
      // The .wat diff is using I8.parseInt has an additional i32.extend8_s (Unknown opcode 192 (0xC0) in zkwasm).
      // output[i / 2] = I8.parseInt(hex.substr(i, 2), 16);

      // @deprecated — Converts a string to an integer of this type. Please use "i32.parse" method.
      // output[i / 2] = I32.parseInt(hex.substr(i, 2), 16);

      output[i / 2] = i32.parse(hex.substr(i, 2), 16);
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

  eq(other: ByteArray): boolean {
    return this.equals(other);
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

  ne(other: ByteArray): boolean {
    return this.notEqual(other);
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

  /**
   *
   * Provable on zkWASM.
   *
   * WASM cost: 133 line of wat.
   */
  slice(start: i32 = 0, end: i32 = this.length): Bytes {
    const len = this.length;

    // Original Bytes is empty.
    if (len === 0) return Bytes.empty();

    // Handle last index
    if (end === -1) end = len;

    // Handle error inputs
    if (start >= end) {
      return Bytes.empty();
    }

    return Bytes.fromU8Array(super.slice(start, end));
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
  // toU32(): u32 {
  //   assert(this.length <= 4);
  //   var rst: u32 = 0;
  //   for (var i = 0; i < min(4, this.length); i++) {
  //     rst = rst << 8;
  //     rst += this[i];
  //   }
  //   return rst;
  // }

  /**
   *
   * Provable on zkWASM.
   *
   * WASM cost: 65 line of wat.
   */
  padStart (targetLength: i32, padDigit: u8 = 0): Bytes {
    return this.padTo(targetLength, true, padDigit)
  }

  /**
   * Provable on zkWASM.
   *
   * WASM cost: 65 line of wat.
   */
  padEnd (targetLength: i32, padDigit: u8 = 0): Bytes {
    return this.padTo(targetLength, false, padDigit)
  }

  private padTo(
    targetLength: i32,
    isPadStart: bool = true,
    padDigit: u8 = 0
  ): Bytes {
    if (targetLength <= this.length) return this;

    // Prepare padding bytes
    let _padding = new Bytes(targetLength - this.length);
    if (padDigit != 0) {
      _padding.fill(padDigit);
    }
    // Concat
    let rst: ByteArray;
    if (isPadStart) {
      // pre-padding
      rst = _padding.concat(this);
    } else {
      // post-padding
      rst = this.concat(_padding);
    }
    return changetype<Bytes>(rst);
  }

  // Disabled due to the existence of implementation of ByteArray
  // @operator("==")
  // __opeq(right: Bytes): bool {
  //   if (this.length != right.length) {
  //     // console.log(this.length.toString() + '---' + right.length.toString());
  //     return false;
  //   }
  //   for (var i = 0; i < this.length; i++) {
  //     if (this[i] != right[i]) {
  //       return false;
  //     }
  //   }
  //   return true;
  // }
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
  static fromU8Array(uint8Array: Uint8Array): Bytes {
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
        `Bytes of length of (not 20) can not be converted to 20 byte addresses`
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
