/**
 * dereference helper
 */
class PtrDeref {
    data: usize
    static read(ptr: usize): usize {
        return changetype<PtrDeref>(ptr).data;
    }
    static write(ptr: usize, val: usize): void {
        changetype<PtrDeref>(ptr).data = val;
    }
}

/**
 * Uint8Array with clean 'new' and fill without memory.fill
 */
export class Bytes extends Uint8Array {
    // clean/unsafe version of new Array<u8>(_len)
    static new(_len: i32): Bytes {
        // alloc Array<u8> mem
        var _bytes_ptr = heap.alloc(12); // offsetof<B>() == 12
        // alloc data mem
        var _arr_heap_ptr = heap.alloc(_len)
        // write data ptr to the 0th, 1st fields of Array<u8>
        PtrDeref.write(_bytes_ptr, _arr_heap_ptr);
        PtrDeref.write(_bytes_ptr + 4, _arr_heap_ptr);

        var _bytes = changetype<Bytes>(_bytes_ptr);
        // write data len to the 2nd, 3rd fields of Array<u8>, equivalent to .length=_len
        PtrDeref.write(_bytes_ptr + 8, _len);
        return _bytes;
    }
    fill(_val: u8 = 0): void {
        for (var i: i32 = 0; i < this.length; i++) {
            this[i] = _val;
        }
        // this.arr.fill(_val)
    }

    slice(start: i32, end: i32): Bytes {
        if (start < 0 || end < 0 || start > this.length || end > this.length || start >= end) {
            return Bytes.new(0);
            // throw new Error("Invalid slice parameters");
        }

        const len = end - start;
        var dst = Bytes.new(len);
        for (let i: i32 = 0; i < len; i++) {
            dst[i] = this[start + i];
        }

        return dst
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

    @operator('==')
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
