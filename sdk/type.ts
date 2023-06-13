/**
 * dereference helper
 */
class PtrDeref {
  data: usize;
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

  fill(_val: u8 = 0): void {
    for (var i: i32 = 0; i < this.length; i++) {
      this[i] = _val;
    }
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
}
