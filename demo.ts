export function zkmain(): void {
    var esig = read_bytes_from_u64(32);
    var topic1 = read_bytes_from_u64(32);
    var topic2 = read_bytes_from_u64(32);
    var topic3 = read_bytes_from_u64(32);
    var data = read_len_then_bytes()

    var expected_output = read_bytes_from_u64(32);

    var output = handleEvent(esig as Uint8Array, topic1 as Uint8Array, topic2 as Uint8Array, topic3 as Uint8Array, data as Uint8Array) as Bytes;

    require(output == expected_output);
}

export function handleEvent(esig: Uint8Array, topic1: Uint8Array, topic2: Uint8Array, topic3: Uint8Array, data: Uint8Array): Uint8Array {
    var source = changetype<Bytes>(data);
    let reserve0 = source.slice(31, 32);
    let reserve1 = source.slice(63, 64);

    let state = Bytes.new(32);
    state[31] = reserve0.toU32() / reserve1.toU32();
    return state as Uint8Array;
}

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
class Bytes extends Uint8Array {
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

// used in asc to rm env.abort
function abort(a:usize, b:usize, c:u32, d:u32):void{}

@external("env", "wasm_input")
declare function wasm_input(x: i32): i64

@external("env", "require")
export declare function require(x: i32): void

export function wasm_private_input(): i64
{
  return wasm_input(0);
}

export function wasm_public_input(): i64
{
  return wasm_input(1);
}

export function read_bytes_from_u64_to_dst(dst: Bytes, byte_length: i32): Bytes {
    var dst64 = changetype<Uint64Array>(dst);
    for (var i:i32 = 0; i * 8 < byte_length; i++)
    {
        if (i * 8 + 8 < byte_length)
        {
            dst64[i] = wasm_private_input();
        }
        else
        {
            // less then 8 bytes on demand
            var u64_cache = wasm_private_input();
            var u8_cache: i64 = u64_cache;
            for (var j:i32 = i * 8; j < byte_length; j++)
            {
                let u8_t =  u8_cache as u8;
                dst[j] = u8_t;
                u8_cache = u8_cache >> 8
            }
        }
    }
    return dst;
}

export function read_bytes_from_u64(byte_length: i32): Bytes {
    var dst = Bytes.new(byte_length);
    read_bytes_from_u64_to_dst(dst, byte_length);
    return dst;
}

export function read_len_then_bytes(): Bytes {
    var blen = wasm_private_input() as i32;
    var bytes = read_bytes_from_u64(blen);
    return bytes;
}

