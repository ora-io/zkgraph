// zkWASM friendly and Subgraph compatible AssemblyScript API for zkGraph:
// (https://thegraph.com/docs/en/developing/assemblyscript-api/)
// Reference Implementation:
// (https://github.com/graphprotocol/graph-tooling/tree/main/packages/ts)

/**
 * dereference helper
 */
class PtrDeref {
  data: usize = 0;
  static read(ptr: usize): usize {
    return changetype<PtrDeref>(ptr).data;
  }
  static write(ptr: usize, val: usize): void {
    changetype<PtrDeref>(ptr).data = val;
  }
}

let _available_ptr: usize = 10000; // in js local: max mem size == 65535 (guess)
function _static_alloc(_len: usize): usize {
  var _pre_ptr = _available_ptr;
  _available_ptr += _len;
  return _pre_ptr;
}

/**
 * Bytes class
 * Uint8Array with clean 'new' and fill without memory.fill
 */
export class Bytes extends Uint8Array {
  // clean/unsafe version of new Array<u8>(_len)

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

  static fromRawarrPtr(_arr_heap_ptr: usize, _len: i32): Bytes {
    // var _bytes_ptr = heap.alloc(12); // size of Uint8Array == 3*4 == 12
    var _bytes_ptr = _static_alloc(12);
    PtrDeref.write(_bytes_ptr, _arr_heap_ptr);
    PtrDeref.write(_bytes_ptr + 4, _arr_heap_ptr);
    PtrDeref.write(_bytes_ptr + 8, _len);
    return changetype<Bytes>(_bytes_ptr);
  }

  toRawarrPtr(): usize {
    return PtrDeref.read(changetype<usize>(this));
  }

  fill(_val: u8 = 0): this {
    for (var i: i32 = 0; i < this.length; i++) {
      this[i] = _val;
    }
    return this;
    // this.arr.fill(_val)
  }

  slice(start: i32, end: i32): Bytes {
    if (
      start < 0 ||
      end < 0 ||
      start > this.length ||
      end > this.length ||
      start >= end
    ) {
      return Bytes.new(0);
      // throw new Error("Invalid slice parameters");
    }

    const len = end - start;
    var dst = Bytes.new(len);
    for (let i: i32 = 0; i < len; i++) {
      dst[i] = this[start + i];
    }

    return dst;
  }

  toU32(): u32 {
    assert(this.length <= 4);
    var rst: u32 = 0;
    for (var i = 0; i < min(4, this.length); i++) {
      rst = rst << 8;
      rst += this[i];
    }
    return rst;
  }

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

  static fromHexString(hex: string): Bytes {
    if (hex.length % 2 !== 0) {
      throw new Error("Input length must be even.");
    }

    const startIndex = hex.startsWith("0x") ? 2 : 0;
    const byteLength = (hex.length - startIndex) / 2;
    const arr = new Bytes(byteLength);

    for (let i = 0; i < byteLength; i++) {
      const byteHex = hex.substr(startIndex + i * 2, 2);
      arr[i] = parseInt(byteHex, 16);
    }

    return arr;
  }

  static fromI32(i: i32): Bytes {
    const arr = Bytes.new(4);
    arr[0] = i & 0xff;
    arr[1] = (i >> 8) & 0xff;
    arr[2] = (i >> 16) & 0xff;
    arr[3] = (i >> 24) & 0xff;
    return arr;
  }

  // These two functions generates ~1k lines of wat
  toHex(): string {
    let hex = "0x";
    for (let i = 0; i < this.length; i++) {
      const byteHex = this[i].toString(16).padStart(2, "0");
      hex += byteHex;
    }
    return hex;
  }

  toString(): string {
    let str = "";
    for (let i = 0; i < this.length; i++) {
      str += String.fromCharCode(this[i]);
    }
    return str;
  }

  // Maybe need a foreign for this in zkwasm
  // toBase58(): string {
  //   // Implementation of base58 encoding
  //   // ...
  // }

  concat(other: Bytes): Bytes {
    const length = this.length + other.length;
    const result = Bytes.new(length);

    for (let i = 0; i < this.length; i++) {
      result[i] = this[i];
    }

    for (let i = 0; i < other.length; i++) {
      result[this.length + i] = other[i];
    }

    return result;
  }

  concatI32(other: i32): Bytes {
    const intArr = Bytes.fromI32(other);
    return this.concat(intArr);
  }
}

export class ByteArray extends Uint8Array {
  static new(length: i32): ByteArray {
    const arrDataPtr = _static_alloc(length);
    const bytesPtr = _static_alloc(12);
    PtrDeref.write(bytesPtr, arrDataPtr);
    PtrDeref.write(bytesPtr + 4, arrDataPtr);
    PtrDeref.write(bytesPtr + 8, length);
    return changetype<ByteArray>(bytesPtr);
  }

  static fromI32(x: i32): ByteArray {
    const bytes = ByteArray.new(4);
    bytes[0] = x & 0xff;
    bytes[1] = (x >> 8) & 0xff;
    bytes[2] = (x >> 16) & 0xff;
    bytes[3] = (x >> 24) & 0xff;
    return bytes;
  }

  static fromHexString(hex: string): ByteArray {
    if (hex.length % 2 !== 0) {
      throw new Error("Input length must be even.");
    }

    const startIndex = hex.startsWith("0x") ? 2 : 0;
    const byteLength = (hex.length - startIndex) / 2;
    const arr = ByteArray.new(byteLength);

    for (let i = 0; i < byteLength; i++) {
      const byteHex = hex.substr(startIndex + i * 2, 2);
      arr[i] = parseInt(byteHex, 16);
    }

    return arr;
  }

  toHexString(): string {
    let hex = "0x";
    for (let i = 0; i < this.length; i++) {
      const byteHex = this[i].toString(16).padStart(2, "0");
      hex += byteHex;
    }
    return hex;
  }

  toString(): string {
    let str = "";
    for (let i = 0; i < this.length; i++) {
      str += String.fromCharCode(this[i]);
    }
    return str;
  }

  // Maybe need a foreign for this in zkwasm
  // toBase58(): string {
  //   // Implementation of base58 encoding
  //   // ...
  // }

  toU32(): u32 {
    if (this.length > 4) {
      throw new Error("Overflow: Byte array cannot be converted to u32");
    }
    let result: u32 = 0;
    for (let i = 0; i < this.length; i++) {
      result |= (<u32>this[i]) << (8 * i);
    }
    return result;
  }

  toI32(): i32 {
    if (this.length > 4) {
      throw new Error("Overflow: Byte array cannot be converted to i32");
    }
    let result: i32 = 0;
    for (let i = 0; i < this.length; i++) {
      result |= (<i32>this[i]) << (8 * i);
    }
    return result;
  }

  equals(y: ByteArray): bool {
    if (this.length !== y.length) {
      return false;
    }
    for (let i = 0; i < this.length; i++) {
      if (this[i] !== y[i]) {
        return false;
      }
    }
    return true;
  }

  concat(other: ByteArray): ByteArray {
    const length = this.length + other.length;
    const result = ByteArray.new(length);

    for (let i = 0; i < this.length; i++) {
      result[i] = this[i];
    }

    for (let i = 0; i < other.length; i++) {
      result[this.length + i] = other[i];
    }

    return result;
  }

  concatI32(other: i32): ByteArray {
    const intArr = ByteArray.fromI32(other);
    return this.concat(intArr);
  }
}

/**
 * Address class
 * 20-byte Ethereum address
 */
export class Address extends Bytes {
  static fromString(s: string): Address {
    // not sure if this works without conversion.ts
    return changetype<Address>(changetype<Bytes>(s));
  }

  /** Convert `Bytes` that must be exactly 20 bytes long to an address.
   * Passing in a value with fewer or more bytes will result in an error */
  static fromBytes(b: Bytes): Address {
    if (b.length != 20) {
      throw new Error(
        `Bytes of length ${b.length} can not be converted to 20 byte addresses`
      );
    }
    return changetype<Address>(b);
  }

  static zero(): Address {
    const self = ByteArray.new(20);

    for (let i = 0; i < 20; i++) {
      self[i] = 0;
    }

    return changetype<Address>(self);
  }
}
